import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TabKey = 'HOME' | 'FEEDING' | 'DIAPER' | 'SLEEP' | 'MEMO';
type LogType = 'FEEDING' | 'DIAPER' | 'SLEEP' | 'GROWTH' | 'DIARY';
type FeedingType = 'FORMULA' | 'BREAST' | 'PUMPED_MILK' | 'BABY_FOOD';
type DiaperContent = 'PEE' | 'POOP' | 'BOTH' | 'DRY';

type Baby = {
  id: number;
  name: string;
  birthDate: string;
  gender: 'FEMALE' | 'MALE' | 'UNSPECIFIED';
};

type BabyLog = {
  id: number;
  babyId: number;
  type: LogType;
  occurredAt: string;
  feedingType?: FeedingType;
  amountMl?: number;
  diaperContent?: DiaperContent;
  startedAt?: string;
  endedAt?: string;
  weightKg?: number;
  heightCm?: number;
  note?: string;
};

type TodaySummary = {
  date: string;
  feedingCount: number;
  totalFeedingAmountMl: number;
  diaperCount: number;
  peeCount: number;
  poopCount: number;
  sleepSessionCount: number;
  totalSleepMinutes: number;
  sleepingNow: boolean;
};

const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080',
  default: 'http://localhost:8080',
});

const defaultSummary: TodaySummary = {
  date: '',
  feedingCount: 0,
  totalFeedingAmountMl: 0,
  diaperCount: 0,
  peeCount: 0,
  poopCount: 0,
  sleepSessionCount: 0,
  totalSleepMinutes: 0,
  sleepingNow: false,
};

const feedingTypeLabels: Record<FeedingType, string> = {
  FORMULA: '분유',
  BREAST: '모유',
  PUMPED_MILK: '유축',
  BABY_FOOD: '이유식',
};

const diaperLabels: Record<DiaperContent, string> = {
  PEE: '소변',
  POOP: '대변',
  BOTH: '둘다',
  DRY: '마름',
};

const tabItems: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: 'HOME', label: '홈', icon: '🏠' },
  { key: 'FEEDING', label: '수유', icon: '🍼' },
  { key: 'DIAPER', label: '기저귀', icon: '🧷' },
  { key: 'SLEEP', label: '수면', icon: '😴' },
  { key: 'MEMO', label: '메모', icon: '📝' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('HOME');
  const [baby, setBaby] = useState<Baby | null>(null);
  const [logs, setLogs] = useState<BabyLog[]>([]);
  const [summary, setSummary] = useState<TodaySummary>(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [feedingType, setFeedingType] = useState<FeedingType>('FORMULA');
  const [amountMl, setAmountMl] = useState('');
  const [diaperContent, setDiaperContent] = useState<DiaperContent>('PEE');
  const [sleepMinutes, setSleepMinutes] = useState('30');
  const [isSleepTimerRunning, setIsSleepTimerRunning] = useState(false);
  const [sleepStartedAt, setSleepStartedAt] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');

  useEffect(() => {
    bootstrap();
  }, []);

  const lastFeedAt = useMemo(() => logs.find((log) => log.type === 'FEEDING')?.occurredAt, [logs]);
  const lastDiaperAt = useMemo(() => logs.find((log) => log.type === 'DIAPER')?.occurredAt, [logs]);
  const lastSleepAt = useMemo(() => logs.find((log) => log.type === 'SLEEP')?.occurredAt, [logs]);
  const lastGrowth = useMemo(() => logs.find((log) => log.type === 'GROWTH'), [logs]);
  const memoLogs = useMemo(() => logs.filter((log) => log.type === 'DIARY' || log.type === 'GROWTH'), [logs]);

  const bootstrap = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const activeBaby = await getOrCreateBaby();
      setBaby(activeBaby);
      await refreshBabyData(activeBaby.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const refreshBabyData = async (babyId: number) => {
    const [nextLogs, nextSummary] = await Promise.all([
      apiGet<BabyLog[]>(`/api/logs?babyId=${babyId}`),
      apiGet<TodaySummary>(`/api/summaries/today?babyId=${babyId}`),
    ]);
    setLogs(nextLogs);
    setSummary(nextSummary);
  };

  const saveLog = async (payload: Record<string, unknown>) => {
    if (!baby) return;

    try {
      setSaving(true);
      setErrorMessage(null);
      await apiPost<BabyLog>('/api/logs', payload);
      await refreshBabyData(baby.id);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      Alert.alert('저장 실패', message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFeeding = async () => {
    if (!baby) return;
    if (!amountMl.trim() || Number(amountMl) <= 0) {
      Alert.alert('확인', '수유량을 ml 단위 숫자로 입력해줘.');
      return;
    }

    await saveLog({
      babyId: baby.id,
      type: 'FEEDING',
      occurredAt: toLocalDateTime(new Date()),
      feedingType,
      amountMl: Number(amountMl),
    });
    setAmountMl('');
  };

  const handleSaveDiaper = async () => {
    if (!baby) return;
    await saveLog({
      babyId: baby.id,
      type: 'DIAPER',
      occurredAt: toLocalDateTime(new Date()),
      diaperContent,
    });
  };

  const handleSaveSleep = async () => {
    if (!baby) return;
    if (!sleepMinutes.trim() || Number(sleepMinutes) <= 0) {
      Alert.alert('확인', '수면 시간을 분 단위 숫자로 입력해줘.');
      return;
    }

    const endedAt = new Date();
    const startedAt = new Date(endedAt.getTime() - Number(sleepMinutes) * 60 * 1000);
    await saveLog({
      babyId: baby.id,
      type: 'SLEEP',
      occurredAt: toLocalDateTime(startedAt),
      startedAt: toLocalDateTime(startedAt),
      endedAt: toLocalDateTime(endedAt),
    });
    setSleepMinutes('30');
  };

  const handleSleepTimer = async () => {
    if (!baby) return;
    if (!isSleepTimerRunning) {
      setIsSleepTimerRunning(true);
      setSleepStartedAt(toLocalDateTime(new Date()));
      return;
    }

    await saveLog({
      babyId: baby.id,
      type: 'SLEEP',
      occurredAt: sleepStartedAt ?? toLocalDateTime(new Date()),
      startedAt: sleepStartedAt ?? toLocalDateTime(new Date()),
      endedAt: toLocalDateTime(new Date()),
      note: '타이머로 기록됨',
    });
    setIsSleepTimerRunning(false);
    setSleepStartedAt(null);
  };

  const handleSaveMemo = async () => {
    if (!baby) return;
    if (!memo.trim()) {
      Alert.alert('확인', '메모 내용을 입력해줘.');
      return;
    }

    await saveLog({
      babyId: baby.id,
      type: 'DIARY',
      occurredAt: toLocalDateTime(new Date()),
      note: memo.trim(),
    });
    setMemo('');
  };

  const handleSaveGrowth = async () => {
    if (!baby) return;
    if (!weightKg.trim() && !heightCm.trim()) {
      Alert.alert('확인', '몸무게나 키 중 하나는 입력해줘.');
      return;
    }

    await saveLog({
      babyId: baby.id,
      type: 'GROWTH',
      occurredAt: toLocalDateTime(new Date()),
      weightKg: weightKg ? Number(weightKg) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
    });
    setWeightKg('');
    setHeightCm('');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loadingText}>BabyLog 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (errorMessage && !baby) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorTitle}>서버 연결이 필요해</Text>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={bootstrap}>
          <Text style={styles.primaryButtonText}>다시 연결</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        <ScrollView contentContainerStyle={styles.content}>
          <Header baby={baby} />
          {!!errorMessage && <Text style={styles.warningText}>{errorMessage}</Text>}

          {activeTab === 'HOME' && (
            <HomeTab
              summary={summary}
              logs={logs}
              lastFeedAt={lastFeedAt}
              lastDiaperAt={lastDiaperAt}
              lastSleepAt={lastSleepAt}
              lastGrowth={lastGrowth}
            />
          )}

          {activeTab === 'FEEDING' && (
            <FeedingTab
              feedingType={feedingType}
              setFeedingType={setFeedingType}
              amountMl={amountMl}
              setAmountMl={setAmountMl}
              saving={saving}
              onSave={handleSaveFeeding}
            />
          )}

          {activeTab === 'DIAPER' && (
            <DiaperTab
              diaperContent={diaperContent}
              setDiaperContent={setDiaperContent}
              saving={saving}
              onSave={handleSaveDiaper}
            />
          )}

          {activeTab === 'SLEEP' && (
            <SleepTab
              sleepMinutes={sleepMinutes}
              setSleepMinutes={setSleepMinutes}
              isSleepTimerRunning={isSleepTimerRunning}
              sleepStartedAt={sleepStartedAt}
              saving={saving}
              onSave={handleSaveSleep}
              onTimerPress={handleSleepTimer}
            />
          )}

          {activeTab === 'MEMO' && (
            <MemoTab
              memo={memo}
              setMemo={setMemo}
              weightKg={weightKg}
              setWeightKg={setWeightKg}
              heightCm={heightCm}
              setHeightCm={setHeightCm}
              saving={saving}
              memoLogs={memoLogs}
              onSaveMemo={handleSaveMemo}
              onSaveGrowth={handleSaveGrowth}
            />
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          {tabItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.navItem, activeTab === item.key && styles.navItemActive]}
              onPress={() => setActiveTab(item.key)}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, activeTab === item.key && styles.navLabelActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function Header({ baby }: { baby: Baby | null }) {
  return (
    <View>
      <Text style={styles.appName}>BabyLog</Text>
      <Text style={styles.subtitle}>{baby?.name ?? '우리 아기'} · D+{baby ? getAgeInDays(baby.birthDate) : 0}</Text>
    </View>
  );
}

function HomeTab({
  summary,
  logs,
  lastFeedAt,
  lastDiaperAt,
  lastSleepAt,
  lastGrowth,
}: {
  summary: TodaySummary;
  logs: BabyLog[];
  lastFeedAt?: string;
  lastDiaperAt?: string;
  lastSleepAt?: string;
  lastGrowth?: BabyLog;
}) {
  return (
    <>
      <View style={styles.summaryGrid}>
        <SummaryCard label="수유" value={`${summary.feedingCount}회`} helper={`${summary.totalFeedingAmountMl}ml`} />
        <SummaryCard label="기저귀" value={`${summary.diaperCount}회`} helper={`대변 ${summary.poopCount}회`} />
        <SummaryCard label="수면" value={`${summary.totalSleepMinutes}분`} helper="오늘 누적" />
      </View>

      <View style={styles.cardDark}>
        <Text style={styles.cardDarkTitle}>오늘 상태</Text>
        <Text style={styles.cardDarkText}>마지막 수유: {lastFeedAt ? formatDisplayDateTime(lastFeedAt) : '없음'}</Text>
        <Text style={styles.cardDarkText}>마지막 기저귀: {lastDiaperAt ? formatDisplayDateTime(lastDiaperAt) : '없음'}</Text>
        <Text style={styles.cardDarkText}>마지막 수면: {lastSleepAt ? formatDisplayDateTime(lastSleepAt) : '없음'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>성장 요약</Text>
        <View style={styles.twoColumnRow}>
          <InfoTile label="몸무게" value={lastGrowth?.weightKg ? `${lastGrowth.weightKg}kg` : '-'} />
          <InfoTile label="키" value={lastGrowth?.heightCm ? `${lastGrowth.heightCm}cm` : '-'} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>최근 기록</Text>
        {logs.length === 0 ? <Text style={styles.emptyText}>아직 기록이 없어.</Text> : (
          <FlatList
            data={logs.slice(0, 5)}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => <TimelineItem item={item} />}
          />
        )}
      </View>
    </>
  );
}

function FeedingTab({ feedingType, setFeedingType, amountMl, setAmountMl, saving, onSave }: {
  feedingType: FeedingType;
  setFeedingType: (value: FeedingType) => void;
  amountMl: string;
  setAmountMl: (value: string) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.screenTitle}>🍼 수유 기록</Text>
      <Text style={styles.mutedText}>수유 종류와 양만 빠르게 남겨.</Text>
      <View style={styles.optionRow}>
        {Object.entries(feedingTypeLabels).map(([key, label]) => (
          <OptionButton key={key} label={label} active={feedingType === key} onPress={() => setFeedingType(key as FeedingType)} />
        ))}
      </View>
      <TextInput style={styles.input} placeholder="수유량 ml (예: 120)" keyboardType="numeric" value={amountMl} onChangeText={setAmountMl} />
      <PrimaryButton label={saving ? '저장 중...' : '수유 저장'} onPress={onSave} disabled={saving} />
    </View>
  );
}

function DiaperTab({ diaperContent, setDiaperContent, saving, onSave }: {
  diaperContent: DiaperContent;
  setDiaperContent: (value: DiaperContent) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.screenTitle}>🧷 기저귀 기록</Text>
      <Text style={styles.mutedText}>상태만 선택하면 바로 저장돼.</Text>
      <View style={styles.optionGrid}>
        {Object.entries(diaperLabels).map(([key, label]) => (
          <OptionButton key={key} label={label} active={diaperContent === key} onPress={() => setDiaperContent(key as DiaperContent)} />
        ))}
      </View>
      <PrimaryButton label={saving ? '저장 중...' : `${diaperLabels[diaperContent]} 기록 저장`} onPress={onSave} disabled={saving} />
    </View>
  );
}

function SleepTab({ sleepMinutes, setSleepMinutes, isSleepTimerRunning, sleepStartedAt, saving, onSave, onTimerPress }: {
  sleepMinutes: string;
  setSleepMinutes: (value: string) => void;
  isSleepTimerRunning: boolean;
  sleepStartedAt: string | null;
  saving: boolean;
  onSave: () => void;
  onTimerPress: () => void;
}) {
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.screenTitle}>😴 수면 타이머</Text>
        <Text style={styles.mutedText}>{isSleepTimerRunning ? `${formatDisplayDateTime(sleepStartedAt ?? '')}부터 자는 중` : '재우기 시작할 때 누르고, 깼을 때 종료해.'}</Text>
        <TouchableOpacity style={[styles.timerButton, isSleepTimerRunning && styles.timerButtonStop]} onPress={onTimerPress} disabled={saving}>
          <Text style={styles.timerButtonText}>{isSleepTimerRunning ? '수면 종료' : '수면 시작'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>빠른 수면 기록</Text>
        <TextInput style={styles.input} placeholder="수면 시간 분 (예: 45)" keyboardType="numeric" value={sleepMinutes} onChangeText={setSleepMinutes} />
        <PrimaryButton label={saving ? '저장 중...' : '수면 저장'} onPress={onSave} disabled={saving} />
      </View>
    </>
  );
}

function MemoTab({ memo, setMemo, weightKg, setWeightKg, heightCm, setHeightCm, saving, memoLogs, onSaveMemo, onSaveGrowth }: {
  memo: string;
  setMemo: (value: string) => void;
  weightKg: string;
  setWeightKg: (value: string) => void;
  heightCm: string;
  setHeightCm: (value: string) => void;
  saving: boolean;
  memoLogs: BabyLog[];
  onSaveMemo: () => void;
  onSaveGrowth: () => void;
}) {
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.screenTitle}>📝 메모 / 일기</Text>
        <TextInput style={[styles.input, styles.memoInput]} placeholder="오늘의 육아 메모" value={memo} onChangeText={setMemo} multiline />
        <PrimaryButton label={saving ? '저장 중...' : '메모 저장'} onPress={onSaveMemo} disabled={saving} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>성장 기록</Text>
        <View style={styles.twoColumnRow}>
          <TextInput style={[styles.input, styles.halfInput]} placeholder="몸무게 kg" keyboardType="numeric" value={weightKg} onChangeText={setWeightKg} />
          <TextInput style={[styles.input, styles.halfInput]} placeholder="키 cm" keyboardType="numeric" value={heightCm} onChangeText={setHeightCm} />
        </View>
        <PrimaryButton label={saving ? '저장 중...' : '성장 기록 저장'} onPress={onSaveGrowth} disabled={saving} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>최근 메모</Text>
        {memoLogs.length === 0 ? <Text style={styles.emptyText}>아직 메모가 없어.</Text> : memoLogs.map((item) => <TimelineItem key={item.id} item={item} />)}
      </View>
    </>
  );
}

function SummaryCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryHelper}>{helper}</Text>
    </View>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoTile}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function OptionButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.optionButton, active && styles.optionButtonActive]} onPress={onPress}>
      <Text style={[styles.optionButtonText, active && styles.optionButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function PrimaryButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity style={[styles.primaryButton, disabled && styles.disabledButton]} onPress={onPress} disabled={disabled}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function TimelineItem({ item }: { item: BabyLog }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineIcon}><Text>{getLogEmoji(item.type)}</Text></View>
      <View style={styles.timelineBody}>
        <Text style={styles.timelineTitle}>{getLogLabel(item)}</Text>
        <Text style={styles.timelineMeta}>{formatDisplayDateTime(item.occurredAt)} · {getLogDetail(item)}</Text>
        {!!item.note && <Text style={styles.timelineNote}>{item.note}</Text>}
      </View>
    </View>
  );
}

async function getOrCreateBaby() {
  const babies = await apiGet<Baby[]>('/api/babies');
  if (babies.length > 0) return babies[0];
  return apiPost<Baby>('/api/babies', { name: '우리 아기', birthDate: '2026-06-01', gender: 'UNSPECIFIED' });
}

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) throw new Error(`API 오류 ${response.status}: ${path}`);
  return response.json();
}

async function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`API 저장 실패 ${response.status}: ${path}`);
  return response.json();
}

function getLogEmoji(type: LogType) {
  if (type === 'FEEDING') return '🍼';
  if (type === 'DIAPER') return '🧷';
  if (type === 'SLEEP') return '😴';
  if (type === 'GROWTH') return '📏';
  return '📝';
}

function getLogLabel(log: BabyLog) {
  if (log.type === 'FEEDING') return '수유';
  if (log.type === 'DIAPER') return '기저귀';
  if (log.type === 'SLEEP') return '수면';
  if (log.type === 'GROWTH') return '성장';
  return '메모';
}

function getLogDetail(log: BabyLog) {
  if (log.type === 'FEEDING') return `${log.feedingType ? feedingTypeLabels[log.feedingType] : '수유'} · ${log.amountMl ?? 0}ml`;
  if (log.type === 'DIAPER') return log.diaperContent ? diaperLabels[log.diaperContent] : '기저귀 교체';
  if (log.type === 'SLEEP') return `${getSleepMinutes(log)}분`;
  if (log.type === 'GROWTH') return `${log.weightKg ?? '-'}kg · ${log.heightCm ?? '-'}cm`;
  return '육아일기';
}

function getSleepMinutes(log: BabyLog) {
  if (log.startedAt && log.endedAt) {
    return Math.max(0, Math.round((new Date(log.endedAt).getTime() - new Date(log.startedAt).getTime()) / 60_000));
  }
  return 0;
}

function toLocalDateTime(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

function formatDisplayDateTime(value: string) {
  if (!value) return '-';
  return value.replace('T', ' ').slice(0, 16);
}

function getAgeInDays(birthDate: string) {
  const birth = new Date(`${birthDate}T00:00:00`);
  return Math.max(0, Math.floor((Date.now() - birth.getTime()) / 86_400_000));
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return '알 수 없는 오류가 발생했어.';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff7ed' },
  appShell: { flex: 1 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff7ed', padding: 24, gap: 14 },
  content: { padding: 20, paddingBottom: 110, gap: 16 },
  appName: { fontSize: 32, fontWeight: '900', color: '#7c2d12' },
  subtitle: { marginTop: 4, fontSize: 15, color: '#9a3412' },
  loadingText: { color: '#9a3412', fontWeight: '700' },
  errorTitle: { fontSize: 24, fontWeight: '900', color: '#7c2d12' },
  errorText: { textAlign: 'center', color: '#991b1b', lineHeight: 20 },
  warningText: { backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: 14, padding: 12, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 16, gap: 14 },
  cardDark: { backgroundColor: '#431407', borderRadius: 24, padding: 18, gap: 6 },
  cardDarkTitle: { color: '#fed7aa', fontSize: 19, fontWeight: '900' },
  cardDarkText: { color: '#ffedd5', fontWeight: '600' },
  screenTitle: { fontSize: 24, fontWeight: '900', color: '#111827' },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#111827' },
  mutedText: { color: '#6b7280', lineHeight: 20 },
  summaryGrid: { flexDirection: 'row', gap: 10 },
  summaryCard: { flex: 1, backgroundColor: '#ffffff', padding: 14, borderRadius: 18 },
  summaryLabel: { color: '#9a3412', fontWeight: '800' },
  summaryValue: { marginTop: 8, fontSize: 22, fontWeight: '900', color: '#111827' },
  summaryHelper: { marginTop: 4, fontSize: 12, color: '#6b7280' },
  twoColumnRow: { flexDirection: 'row', gap: 10 },
  infoTile: { flex: 1, backgroundColor: '#fff7ed', borderRadius: 16, padding: 14 },
  infoLabel: { color: '#9a3412', fontWeight: '800' },
  infoValue: { marginTop: 6, color: '#111827', fontSize: 20, fontWeight: '900' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionButton: { borderWidth: 1, borderColor: '#fed7aa', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, backgroundColor: '#fff7ed' },
  optionButtonActive: { backgroundColor: '#431407', borderColor: '#431407' },
  optionButtonText: { color: '#9a3412', fontWeight: '900' },
  optionButtonTextActive: { color: '#ffffff' },
  input: { borderWidth: 1, borderColor: '#fed7aa', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, backgroundColor: '#ffffff' },
  halfInput: { flex: 1 },
  memoInput: { minHeight: 110, textAlignVertical: 'top' },
  primaryButton: { backgroundColor: '#ea580c', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  disabledButton: { opacity: 0.6 },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '900' },
  timerButton: { backgroundColor: '#16a34a', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  timerButtonStop: { backgroundColor: '#dc2626' },
  timerButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '900' },
  emptyText: { color: '#6b7280', lineHeight: 20 },
  separator: { height: 1, backgroundColor: '#ffedd5' },
  timelineRow: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  timelineIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#ffedd5', alignItems: 'center', justifyContent: 'center' },
  timelineBody: { flex: 1 },
  timelineTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  timelineMeta: { marginTop: 4, color: '#6b7280' },
  timelineNote: { marginTop: 6, color: '#374151' },
  bottomNav: { position: 'absolute', left: 14, right: 14, bottom: 14, backgroundColor: '#ffffff', borderRadius: 26, padding: 8, flexDirection: 'row', gap: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 18 },
  navItemActive: { backgroundColor: '#ffedd5' },
  navIcon: { fontSize: 18 },
  navLabel: { marginTop: 3, fontSize: 11, fontWeight: '800', color: '#9ca3af' },
  navLabelActive: { color: '#9a3412' },
});
