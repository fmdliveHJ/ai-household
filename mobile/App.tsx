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

type TransactionType = 'EXPENSE' | 'INCOME';

type TransactionItem = {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  memo: string;
  transactionDate: string;
};

const seedData: TransactionItem[] = [
  {
    id: '1',
    type: 'EXPENSE',
    category: '식비',
    amount: 12000,
    memo: '점심',
    transactionDate: '2026-05-25',
  },
  {
    id: '2',
    type: 'INCOME',
    category: '용돈',
    amount: 50000,
    memo: '이번 주 용돈',
    transactionDate: '2026-05-24',
  },
];

export default function App() {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [transactionDate, setTransactionDate] = useState('2026-05-25');
  const [transactions, setTransactions] = useState<TransactionItem[]>(seedData);

  const totalExpense = useMemo(
    () => transactions
      .filter((item) => item.type === 'EXPENSE')
      .reduce((sum, item) => sum + item.amount, 0),
    [transactions],
  );

  const totalIncome = useMemo(
    () => transactions
      .filter((item) => item.type === 'INCOME')
      .reduce((sum, item) => sum + item.amount, 0),
    [transactions],
  );

  const handleAddTransaction = () => {
    if (!category.trim()) {
      Alert.alert('확인', '카테고리를 입력해줘.');
      return;
    }

    if (!amount.trim() || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('확인', '금액은 0보다 큰 숫자로 입력해줘.');
      return;
    }

    if (!transactionDate.trim()) {
      Alert.alert('확인', '날짜를 입력해줘.');
      return;
    }

    const nextItem: TransactionItem = {
      id: String(Date.now()),
      type,
      category: category.trim(),
      amount: Number(amount),
      memo: memo.trim(),
      transactionDate: transactionDate.trim(),
    };

    setTransactions((prev) => [nextItem, ...prev]);
    setCategory('');
    setAmount('');
    setMemo('');
    setTransactionDate('2026-05-25');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Household</Text>
        <Text style={styles.subtitle}>거래 등록/조회 첫 단계</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>수입</Text>
            <Text style={styles.summaryIncome}>{totalIncome.toLocaleString()}원</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>지출</Text>
            <Text style={styles.summaryExpense}>{totalExpense.toLocaleString()}원</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>거래 추가</Text>

          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'EXPENSE' && styles.typeButtonActive]}
              onPress={() => setType('EXPENSE')}
            >
              <Text style={[styles.typeButtonText, type === 'EXPENSE' && styles.typeButtonTextActive]}>지출</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'INCOME' && styles.typeButtonActive]}
              onPress={() => setType('INCOME')}
            >
              <Text style={[styles.typeButtonText, type === 'INCOME' && styles.typeButtonTextActive]}>수입</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="카테고리 (예: 식비)"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="금액 (예: 12000)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="메모"
            value={memo}
            onChangeText={setMemo}
          />
          <TextInput
            style={styles.input}
            placeholder="날짜 (YYYY-MM-DD)"
            value={transactionDate}
            onChangeText={setTransactionDate}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
            <Text style={styles.addButtonText}>거래 저장</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>거래 목록</Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.transactionRow}>
                <View>
                  <Text style={styles.transactionCategory}>{item.category}</Text>
                  <Text style={styles.transactionMeta}>
                    {item.transactionDate} · {item.memo || '메모 없음'}
                  </Text>
                </View>
                <View style={styles.amountWrap}>
                  <Text style={item.type === 'EXPENSE' ? styles.expenseText : styles.incomeText}>
                    {item.type === 'EXPENSE' ? '-' : '+'}{item.amount.toLocaleString()}원
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  summaryIncome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
  },
  summaryExpense: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dc2626',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  listCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  typeButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  transactionMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
  },
  amountWrap: {
    alignItems: 'flex-end',
  },
  expenseText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '700',
  },
  incomeText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '700',
  },
});
