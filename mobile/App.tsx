import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type LogType = 'FEEDING' | 'DIAPER' | 'SLEEP' | 'GROWTH';
type FeedingType = 'FORMULA' | 'BREAST' | 'PUMPED_MILK' | 'BABY_FOOD';
type DiaperContent = 'PEE' | 'POOP' | 'BOTH' | 'DRY';

type Baby = {
  id: string;
  name: string;
  birthDate: string;
};

type BabyLog = {
  id: string;
  type: LogType;
  occurredAt: string;
  feedingType?: FeedingType;
  amountMl?: number;
  diaperContent?: DiaperContent;
  sleepMinutes?: number;
  weightKg?: number;
  heightCm?: number;
  note?: string;
};

const baby: Baby = {
  id: 'baby-1',
  name: '우리 아기',
  birthDate: '2026-06-01',
};

const seedLogs: BabyLog[] = [
  {
    id: '1',
    type: 'FEEDING',
    occurredAt: '2026-06-21 08:00',
    feedingType: 'FORMULA',
    amountMl: 120,
    note: '잘 먹음',
  },
  {
    id: '2',
    type: 'DIAPER',
    occurredAt: '2026-06-21 09:10',
    diaperContent: 'BOTH',
    note: '대변 상태 정상',
  },
  {
    id: '3',
    type: 'SLEEP',
    occurredAt: '2026-06-21 12:00',
    sleepMinutes: 80,
  },
];

const logTypeLabels: Record<LogType, string> = {
  FEEDING: '수유',
  DIAPER: '기저귀',
  SLEEP: '수면',
  GROWTH: '성장',
};

export default function App() {
  const [selectedType, setSelectedType] = useState<LogType>('FEEDING');
  const [amountMl, setAmountMl] = useState('');
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState<BabyLog[]>(seedLogs);

  const summary = useMemo(() => {
    const feedingLogs = logs.filter((log) => log.type === 'FEEDING');
    const diaperLogs = logs.filter((log) => log.type === 'DIAPER');
    const sleepLogs = logs.filter((log) => log.type === 'SLEEP');

    return {
      feedingCount: feedingLogs.length,
      totalAmountMl: feedingLogs.reduce((sum, log) => sum + (log.amountMl ?? 0), 0),
      diaperCount: diaperLogs.length,
      sleepMinutes: sleepLogs.reduce((sum, log) => sum + (log.sleepMinutes ?? 0), 0),
      lastLogAt: logs[0]?.occurredAt,
    };
  }, [logs]);

  const handleAddLog = () => {
    if (selectedType === 'FEEDING' && (!amountMl.trim() || Number(amountMl) <= 0)) {
      Alert.alert('확인', '수유량을 ml 단위 숫자로 입력해줘.');
      return;
    }

    const now = new Date();
    const occurredAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const nextLog: BabyLog = {
      id: String(Date.now()),
      type: selectedType,
      occurredAt,
      feedingType: selectedType === 'FEEDING' ? 'FORMULA' : undefined,
      amountMl: selectedType === 'FEEDING' ? Number(amountMl) : undefined,
      diaperContent: selectedType === 'DIAPER' ? 'PEE' : undefined,
      sleepMinutes: selectedType === 'SLEEP' ? 30 : undefined,
      note: note.trim(),
    };

    setLogs((prev) => [nextLog, ...prev]);
    setAmountMl('');
    setNote('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.appName}>BabyLog</Text>
          <Text style={styles.subtitle}>{baby.name}의 오늘 육아 기록</Text>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.profileEmoji}>🍼</Text>
          <View>
            <Text style={styles.profileName}>{baby.name}</Text>
            <Text style={styles.profileMeta}>생일 {baby.birthDate}</Text>
            <Text style={styles.profileMeta}>마지막 기록 {summary.lastLogAt ?? '아직 없음'}</Text>
          </View>
        </View>

        <View style={styles.summaryGrid}>
          <SummaryCard label="수유" value={`${summary.feedingCount}회`} helper={`${summary.totalAmountMl}ml`} />
          <SummaryCard label="기저귀" value={`${summary.diaperCount}회`} helper="소변/대변" />
          <SummaryCard label="수면" value={`${summary.sleepMinutes}분`} helper="오늘 누적" />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>빠른 기록</Text>

          <View style={styles.typeRow}>
            {(['FEEDING', 'DIAPER', 'SLEEP', 'GROWTH'] as LogType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeButton, selectedType === type && styles.typeButtonActive]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[styles.typeButtonText, selectedType === type && styles.typeButtonTextActive]}>
                  {logTypeLabels[type]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedType === 'FEEDING' && (
            <TextInput
              style={styles.input}
              placeholder="수유량 ml (예: 120)"
              keyboardType="numeric"
              value={amountMl}
              onChangeText={setAmountMl}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="메모 (선택)"
            value={note}
            onChangeText={setNote}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddLog}>
            <Text style={styles.addButtonText}>{logTypeLabels[selectedType]} 기록 저장</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>오늘 타임라인</Text>
          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => <TimelineItem item={item} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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

function TimelineItem({ item }: { item: BabyLog }) {
  const detail = getLogDetail(item);

  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineIcon}>
        <Text>{getLogEmoji(item.type)}</Text>
      </View>
      <View style={styles.timelineBody}>
        <Text style={styles.timelineTitle}>{logTypeLabels[item.type]}</Text>
        <Text style={styles.timelineMeta}>{item.occurredAt} · {detail}</Text>
        {!!item.note && <Text style={styles.timelineNote}>{item.note}</Text>}
      </View>
    </View>
  );
}

function getLogEmoji(type: LogType) {
  if (type === 'FEEDING') return '🍼';
  if (type === 'DIAPER') return '🧷';
  if (type === 'SLEEP') return '😴';
  return '📏';
}

function getLogDetail(log: BabyLog) {
  if (log.type === 'FEEDING') return `${log.amountMl ?? 0}ml`;
  if (log.type === 'DIAPER') return log.diaperContent === 'BOTH' ? '소변+대변' : '기저귀 교체';
  if (log.type === 'SLEEP') return `${log.sleepMinutes ?? 0}분 수면`;
  return '성장 기록';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7ed',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#7c2d12',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: '#9a3412',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
  },
  profileEmoji: {
    fontSize: 42,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  profileMeta: {
    marginTop: 3,
    color: '#6b7280',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 18,
  },
  summaryLabel: {
    color: '#9a3412',
    fontWeight: '700',
  },
  summaryValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  summaryHelper: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  listCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff7ed',
  },
  typeButtonActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  typeButtonText: {
    color: '#9a3412',
    fontWeight: '700',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#ffffff',
  },
  addButton: {
    backgroundColor: '#ea580c',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  separator: {
    height: 1,
    backgroundColor: '#ffedd5',
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  timelineIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffedd5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineBody: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  timelineMeta: {
    marginTop: 4,
    color: '#6b7280',
  },
  timelineNote: {
    marginTop: 6,
    color: '#374151',
  },
});
