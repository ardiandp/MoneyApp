/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Android Architecture, PRD, ERD & Production Kotlin Source Repository
 */

export interface CodeFile {
  filename: string;
  category: 'Entity' | 'DAO' | 'Database' | 'Repository' | 'ViewModel' | 'Compose UI' | 'Sync & Worker' | 'Config & DI';
  language: 'kotlin' | 'xml' | 'groovy' | 'sql';
  description: string;
  code: string;
}

export const prdDocument = `
# Product Requirement Document (PRD)
## Project Name: Creator Finance
**Target Platform:** Android 8.0+ (API 26 to 35)  
**Architecture:** Clean Architecture + MVVM + Offline First  
**Design System:** Google Material Design 3  

---

### 1. Executive Summary & Vision
Creator Finance is a high-performance personal and micro-business financial OS designed specifically for modern digital workers: content creators, freelancers, independent consultants, online merchants, and agile small businesses. Unlike traditional banking apps that assume a single monthly corporate salary, Creator Finance accommodates erratic multi-source revenue (AdSense, sponsorships, affiliate payouts, client invoices, digital products), variable operational expenses (cloud services, equipment rentals, studio utilities), bidirectional debt/receivable tracking ("Hutang-Piutang"), proactive budget guardrails, and real-time offline-first synchronization with Google Sheets.

### 2. Target Audience Personas
- **Freelance Engineers & Designers:** Tracks client contract milestones, retainer payments, software subscription overhead, and equipment amortization.
- **Content Creators (YouTubers/Streamers):** Balances irregular advertising checks, brand sponsorship deliverables, gear debt, and production budgets.
- **Micro-Business / Online Sellers:** Manages inventory purchase receivables, customer credit, supplier debts, and daily cash flow margins.
- **Independent Professionals & Families:** Enforces monthly expense budgets with green/yellow/red warnings and savings goals.

### 3. Core Functional Requirements
- **F-01: Offline-First Local Store:** Zero latency interactions using Android Room Database (SQLite) with WAL mode enabled.
- **F-02: Multi-Source Income Engine:** Categorized recording with 10 primary funding sources, attachment metadata, search, and export.
- **F-03: Expense & Operating Cost Tracker:** Multi-purpose classification, receipt attachment references, location tagging, and category aggregation.
- **F-04: Debt Center (Hutang-Piutang):** Dual-ledger tracking for liabilities (Hutang) and receivables (Piutang). Tracks partial repayments, due-date status (Active, Partial, Paid, Overdue), and auto-generates reminder flags.
- **F-05: Real-Time Budget Guardrails:** Category-level monthly limits with real-time percentage consumption and color-coded threshold triggers (Green <75%, Yellow 75-100%, Red >100%).
- **F-06: Savings Goals & Milestones:** Milestone tracking with target dates, projected completion rates, deposit recording, and motivational haptic/visual feedback.
- **F-07: Interactive Calendar Matrix:** Monthly matrix view showing cash-in, cash-out, debt maturity dates, and daily transaction details upon date tap.
- **F-08: Financial Intelligence & Reports:** Daily, weekly, monthly, and yearly aggregation. Exportable to PDF, Excel (.xlsx), and standard CSV.
- **F-09: Google Sheets Cloud Sync:** Automated background replication via WorkManager to a designated Google Spreadsheet with 7 dedicated worksheets.
- **F-10: On-Device Hardware Security:** BiometricPrompt integration with fallback 4-digit PIN lock and configurable auto-lock timeout.

### 4. Non-Functional Requirements
- **Performance:** Cold startup time < 800ms; Compose UI render frame rate consistently at 60/120 FPS.
- **Storage:** Database footprint < 15MB for 20,000 transactions; zero uncompressed bitmap leaks.
- **Security:** EncryptedSharedPreferences (MasterKey AES-256 GCM) for authentication credentials and PIN hashes; Room database encryption via SQLCipher ready.
- **Resilience:** Unsent transactions queued in local database with sync flag = false; automatic exponential backoff retry via WorkManager when connectivity restores.
`;

export const erdSchemaSql = `
-- =====================================================================
-- SQLite / Room Database Schema: Creator Finance
-- Database Version: 1 (Room Schema Export Ready)
-- =====================================================================

-- Table 1: users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    is_google_connected INTEGER NOT NULL DEFAULT 0,
    spreadsheet_id TEXT,
    spreadsheet_name TEXT,
    auto_sync_enabled INTEGER NOT NULL DEFAULT 1,
    last_sync_timestamp INTEGER
);

-- Table 2: categories
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'INCOME' or 'EXPENSE'
    icon_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    is_custom INTEGER NOT NULL DEFAULT 0
);

-- Table 3: income_transactions
CREATE TABLE IF NOT EXISTS income_transactions (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL, -- Format: YYYY-MM-DD
    amount REAL NOT NULL,
    funding_source TEXT NOT NULL, -- Salary, Freelance, Business, Client Payment, Affiliate, etc.
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    attachment_uri TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Indexing for fast date range filtering and search
CREATE INDEX IF NOT EXISTS idx_income_date ON income_transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_income_synced ON income_transactions(is_synced);
CREATE INDEX IF NOT EXISTS idx_income_category ON income_transactions(category);

-- Table 4: expense_transactions
CREATE TABLE IF NOT EXISTS expense_transactions (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL, -- Format: YYYY-MM-DD
    amount REAL NOT NULL,
    expense_purpose TEXT NOT NULL, -- Food, Transport, Electricity, Internet, Business, etc.
    category TEXT NOT NULL,
    notes TEXT,
    attachment_uri TEXT,
    location TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Indexing for fast expense queries
CREATE INDEX IF NOT EXISTS idx_expense_date ON expense_transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_expense_synced ON expense_transactions(is_synced);
CREATE INDEX IF NOT EXISTS idx_expense_category ON expense_transactions(category);

-- Table 5: debts (Hutang & Piutang)
CREATE TABLE IF NOT EXISTS debts (
    id TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL, -- 'DEBT' (Hutang) or 'RECEIVABLE' (Piutang)
    person_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    total_amount REAL NOT NULL,
    paid_amount REAL NOT NULL DEFAULT 0.0,
    date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL, -- 'ACTIVE', 'PAID', 'PARTIAL', 'OVERDUE'
    is_synced INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_debts_due_date ON debts(due_date ASC);
CREATE INDEX IF NOT EXISTS idx_debts_type_status ON debts(type, status);

-- Table 6: budgets
CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY NOT NULL,
    category TEXT NOT NULL,
    monthly_limit REAL NOT NULL,
    month_year TEXT NOT NULL, -- Format: YYYY-MM
    created_at INTEGER NOT NULL,
    CONSTRAINT uq_category_month UNIQUE (category, month_year)
);

CREATE INDEX IF NOT EXISTS idx_budget_month ON budgets(month_year);

-- Table 7: savings_goals
CREATE TABLE IF NOT EXISTS savings_goals (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL NOT NULL DEFAULT 0.0,
    target_date TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_name TEXT,
    is_completed INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

-- Table 8: sync_logs
CREATE TABLE IF NOT EXISTS sync_logs (
    id TEXT PRIMARY KEY NOT NULL,
    timestamp INTEGER NOT NULL,
    status TEXT NOT NULL, -- 'SUCCESS', 'FAILED', 'PENDING', 'IN_PROGRESS'
    records_synced INTEGER NOT NULL DEFAULT 0,
    spreadsheet_name TEXT NOT NULL,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_timestamp ON sync_logs(timestamp DESC);
`;

export const kotlinCodeLibrary: CodeFile[] = [
  {
    filename: 'IncomeEntity.kt',
    category: 'Entity',
    language: 'kotlin',
    description: 'Room Entity for income transactions with indexes and sync tracking',
    code: `package com.creatorfinance.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "income_transactions",
    indices = [
        Index(value = ["date"]),
        Index(value = ["is_synced"]),
        Index(value = ["category"])
    ]
)
data class IncomeEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String,

    @ColumnInfo(name = "date")
    val date: String, // YYYY-MM-DD

    @ColumnInfo(name = "amount")
    val amount: Double,

    @ColumnInfo(name = "funding_source")
    val fundingSource: String, // Salary, Freelance, Business, Client Payment, Affiliate, etc.

    @ColumnInfo(name = "category")
    val category: String,

    @ColumnInfo(name = "description")
    val description: String,

    @ColumnInfo(name = "attachment_uri")
    val attachmentUri: String? = null,

    @ColumnInfo(name = "is_synced")
    val isSynced: Boolean = false,

    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "updated_at")
    val updatedAt: Long = System.currentTimeMillis()
)`,
  },
  {
    filename: 'ExpenseEntity.kt',
    category: 'Entity',
    language: 'kotlin',
    description: 'Room Entity for expense transactions with purpose tagging',
    code: `package com.creatorfinance.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "expense_transactions",
    indices = [
        Index(value = ["date"]),
        Index(value = ["is_synced"]),
        Index(value = ["category"])
    ]
)
data class ExpenseEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String,

    @ColumnInfo(name = "date")
    val date: String, // YYYY-MM-DD

    @ColumnInfo(name = "amount")
    val amount: Double,

    @ColumnInfo(name = "expense_purpose")
    val expensePurpose: String, // Food, Transport, Internet, Business, etc.

    @ColumnInfo(name = "category")
    val category: String,

    @ColumnInfo(name = "notes")
    val notes: String? = null,

    @ColumnInfo(name = "attachment_uri")
    val attachmentUri: String? = null,

    @ColumnInfo(name = "location")
    val location: String? = null,

    @ColumnInfo(name = "is_synced")
    val isSynced: Boolean = false,

    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "updated_at")
    val updatedAt: Long = System.currentTimeMillis()
)`,
  },
  {
    filename: 'DebtEntity.kt',
    category: 'Entity',
    language: 'kotlin',
    description: 'Room Entity for Debt Center (Hutang & Piutang) with status & repayment tracking',
    code: `package com.creatorfinance.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "debts",
    indices = [
        Index(value = ["due_date"]),
        Index(value = ["type", "status"])
    ]
)
data class DebtEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String,

    @ColumnInfo(name = "type")
    val type: String, // "DEBT" or "RECEIVABLE"

    @ColumnInfo(name = "person_name")
    val personName: String,

    @ColumnInfo(name = "phone_number")
    val phoneNumber: String,

    @ColumnInfo(name = "total_amount")
    val totalAmount: Double,

    @ColumnInfo(name = "paid_amount")
    val paidAmount: Double = 0.0,

    @ColumnInfo(name = "date")
    val date: String, // YYYY-MM-DD

    @ColumnInfo(name = "due_date")
    val dueDate: String, // YYYY-MM-DD

    @ColumnInfo(name = "notes")
    val notes: String? = null,

    @ColumnInfo(name = "status")
    val status: String, // "ACTIVE", "PAID", "PARTIAL", "OVERDUE"

    @ColumnInfo(name = "is_synced")
    val isSynced: Boolean = false,

    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "updated_at")
    val updatedAt: Long = System.currentTimeMillis()
) {
    val remainingAmount: Double
        get() = (totalAmount - paidAmount).coerceAtLeast(0.0)
}`,
  },
  {
    filename: 'BudgetEntity.kt',
    category: 'Entity',
    language: 'kotlin',
    description: 'Room Entity for monthly category budgets with unique constraints',
    code: `package com.creatorfinance.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "budgets",
    indices = [
        Index(value = ["category", "month_year"], unique = true)
    ]
)
data class BudgetEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String,

    @ColumnInfo(name = "category")
    val category: String,

    @ColumnInfo(name = "monthly_limit")
    val monthlyLimit: Double,

    @ColumnInfo(name = "month_year")
    val monthYear: String, // Format: YYYY-MM

    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis()
)`,
  },
  {
    filename: 'SavingsGoalEntity.kt',
    category: 'Entity',
    language: 'kotlin',
    description: 'Room Entity for financial targets and savings progress tracking',
    code: `package com.creatorfinance.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "savings_goals")
data class SavingsGoalEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String,

    @ColumnInfo(name = "title")
    val title: String,

    @ColumnInfo(name = "target_amount")
    val targetAmount: Double,

    @ColumnInfo(name = "current_amount")
    val currentAmount: Double = 0.0,

    @ColumnInfo(name = "target_date")
    val targetDate: String, // YYYY-MM-DD

    @ColumnInfo(name = "category")
    val category: String,

    @ColumnInfo(name = "icon_name")
    val iconName: String? = null,

    @ColumnInfo(name = "is_completed")
    val isCompleted: Boolean = false,

    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis()
) {
    val progressPercent: Float
        get() = if (targetAmount > 0) ((currentAmount / targetAmount) * 100).toFloat().coerceIn(0f, 100f) else 0f

    val remainingAmount: Double
        get() = (targetAmount - currentAmount).coerceAtLeast(0.0)
}`,
  },
  {
    filename: 'IncomeDao.kt',
    category: 'DAO',
    language: 'kotlin',
    description: 'Data Access Object for Income transactions with Kotlin Flow and aggregation',
    code: `package com.creatorfinance.app.data.local.dao

import androidx.room.*
import com.creatorfinance.app.data.local.entity.IncomeEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface IncomeDao {

    @Query("SELECT * FROM income_transactions ORDER BY date DESC, created_at DESC")
    fun getAllIncomes(): Flow<List<IncomeEntity>>

    @Query("SELECT * FROM income_transactions WHERE date BETWEEN :startDate AND :endDate ORDER BY date DESC")
    fun getIncomesByDateRange(startDate: String, endDate: String): Flow<List<IncomeEntity>>

    @Query("SELECT SUM(amount) FROM income_transactions")
    fun getTotalIncomeAmount(): Flow<Double?>

    @Query("SELECT SUM(amount) FROM income_transactions WHERE date BETWEEN :startDate AND :endDate")
    fun getTotalIncomeBetween(startDate: String, endDate: String): Flow<Double?>

    @Query("SELECT * FROM income_transactions WHERE is_synced = 0")
    suspend fun getUnsyncedIncomes(): List<IncomeEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertIncome(income: IncomeEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(incomes: List<IncomeEntity>)

    @Update
    suspend fun updateIncome(income: IncomeEntity)

    @Delete
    suspend fun deleteIncome(income: IncomeEntity)

    @Query("UPDATE income_transactions SET is_synced = 1 WHERE id IN (:ids)")
    suspend fun markAsSynced(ids: List<String>)
}`,
  },
  {
    filename: 'ExpenseDao.kt',
    category: 'DAO',
    language: 'kotlin',
    description: 'Data Access Object for Expenses with category aggregation and budget queries',
    code: `package com.creatorfinance.app.data.local.dao

import androidx.room.*
import com.creatorfinance.app.data.local.entity.ExpenseEntity
import kotlinx.coroutines.flow.Flow

data class CategoryExpenseSum(
    val category: String,
    val total: Double
)

@Dao
interface ExpenseDao {

    @Query("SELECT * FROM expense_transactions ORDER BY date DESC, created_at DESC")
    fun getAllExpenses(): Flow<List<ExpenseEntity>>

    @Query("SELECT * FROM expense_transactions WHERE date BETWEEN :startDate AND :endDate ORDER BY date DESC")
    fun getExpensesByDateRange(startDate: String, endDate: String): Flow<List<ExpenseEntity>>

    @Query("SELECT SUM(amount) FROM expense_transactions")
    fun getTotalExpenseAmount(): Flow<Double?>

    @Query("SELECT category, SUM(amount) as total FROM expense_transactions WHERE date LIKE :monthYear || '%' GROUP BY category")
    fun getCategorySumsForMonth(monthYear: String): Flow<List<CategoryExpenseSum>>

    @Query("SELECT SUM(amount) FROM expense_transactions WHERE category = :category AND date LIKE :monthYear || '%'")
    fun getSpentForCategory(category: String, monthYear: String): Flow<Double?>

    @Query("SELECT * FROM expense_transactions WHERE is_synced = 0")
    suspend fun getUnsyncedExpenses(): List<ExpenseEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExpense(expense: ExpenseEntity)

    @Update
    suspend fun updateExpense(expense: ExpenseEntity)

    @Delete
    suspend fun deleteExpense(expense: ExpenseEntity)

    @Query("UPDATE expense_transactions SET is_synced = 1 WHERE id IN (:ids)")
    suspend fun markAsSynced(ids: List<String>)
}`,
  },
  {
    filename: 'DebtDao.kt',
    category: 'DAO',
    language: 'kotlin',
    description: 'Data Access Object for Debt Center with due date and overdue filtering',
    code: `package com.creatorfinance.app.data.local.dao

import androidx.room.*
import com.creatorfinance.app.data.local.entity.DebtEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface DebtDao {

    @Query("SELECT * FROM debts WHERE type = :type ORDER BY due_date ASC")
    fun getDebtsByType(type: String): Flow<List<DebtEntity>>

    @Query("SELECT * FROM debts ORDER BY due_date ASC")
    fun getAllDebts(): Flow<List<DebtEntity>>

    @Query("SELECT SUM(total_amount - paid_amount) FROM debts WHERE type = 'DEBT' AND status != 'PAID'")
    fun getTotalDebtOutstanding(): Flow<Double?>

    @Query("SELECT SUM(total_amount - paid_amount) FROM debts WHERE type = 'RECEIVABLE' AND status != 'PAID'")
    fun getTotalReceivableOutstanding(): Flow<Double?>

    @Query("SELECT * FROM debts WHERE due_date <= :currentDate AND status != 'PAID'")
    suspend fun getOverdueDebts(currentDate: String): List<DebtEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDebt(debt: DebtEntity)

    @Update
    suspend fun updateDebt(debt: DebtEntity)

    @Delete
    suspend fun deleteDebt(debt: DebtEntity)

    @Query("UPDATE debts SET paid_amount = :paidAmount, status = :status, is_synced = 0 WHERE id = :id")
    suspend fun updatePayment(id: String, paidAmount: Double, status: String)

    @Query("SELECT * FROM debts WHERE is_synced = 0")
    suspend fun getUnsyncedDebts(): List<DebtEntity>

    @Query("UPDATE debts SET is_synced = 1 WHERE id IN (:ids)")
    suspend fun markAsSynced(ids: List<String>)
}`,
  },
  {
    filename: 'AppDatabase.kt',
    category: 'Database',
    language: 'kotlin',
    description: 'Room Database definition with DAOs, TypeConverters and room migration plan',
    code: `package com.creatorfinance.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.creatorfinance.app.data.local.dao.*
import com.creatorfinance.app.data.local.entity.*

@Database(
    entities = [
        IncomeEntity::class,
        ExpenseEntity::class,
        DebtEntity::class,
        BudgetEntity::class,
        SavingsGoalEntity::class
    ],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun incomeDao(): IncomeDao
    abstract fun expenseDao(): ExpenseDao
    abstract fun debtDao(): DebtDao
    abstract fun budgetDao(): BudgetDao
    abstract fun savingsGoalDao(): SavingsGoalDao

    companion object {
        const val DATABASE_NAME = "creator_finance.db"
    }
}`,
  },
  {
    filename: 'FinanceRepository.kt',
    category: 'Repository',
    language: 'kotlin',
    description: 'Clean Architecture Repository Interface orchestrating Room and Google Sheets sync',
    code: `package com.creatorfinance.app.domain.repository

import com.creatorfinance.app.data.local.entity.*
import kotlinx.coroutines.flow.Flow

interface FinanceRepository {
    // Incomes
    fun getAllIncomes(): Flow<List<IncomeEntity>>
    suspend fun insertIncome(income: IncomeEntity)
    suspend fun updateIncome(income: IncomeEntity)
    suspend fun deleteIncome(income: IncomeEntity)

    // Expenses
    fun getAllExpenses(): Flow<List<ExpenseEntity>>
    suspend fun insertExpense(expense: ExpenseEntity)
    suspend fun updateExpense(expense: ExpenseEntity)
    suspend fun deleteExpense(expense: ExpenseEntity)

    // Debts & Receivables
    fun getDebtsByType(type: String): Flow<List<DebtEntity>>
    suspend fun insertDebt(debt: DebtEntity)
    suspend fun recordDebtPayment(debtId: String, amount: Double)
    suspend fun deleteDebt(debt: DebtEntity)

    // Budgets
    fun getBudgetsForMonth(monthYear: String): Flow<List<BudgetEntity>>
    suspend fun setBudget(budget: BudgetEntity)
    suspend fun deleteBudget(budget: BudgetEntity)

    // Savings Goals
    fun getAllSavingsGoals(): Flow<List<SavingsGoalEntity>>
    suspend fun insertSavingsGoal(goal: SavingsGoalEntity)
    suspend fun depositToGoal(goalId: String, amount: Double)
    suspend fun deleteSavingsGoal(goal: SavingsGoalEntity)

    // Synchronization
    suspend fun syncUnsyncedRecordsWithGoogleSheets(): Result<Int>
}`,
  },
  {
    filename: 'DashboardViewModel.kt',
    category: 'ViewModel',
    language: 'kotlin',
    description: 'StateFlow-driven ViewModel powering Dashboard analytics, KPIs, and chart data',
    code: `package com.creatorfinance.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.creatorfinance.app.domain.repository.FinanceRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class DashboardUiState(
    val currentBalance: Double = 0.0,
    val totalIncome: Double = 0.0,
    val totalExpense: Double = 0.0,
    val netProfit: Double = 0.0,
    val totalDebt: Double = 0.0,
    val totalReceivable: Double = 0.0,
    val isLoading: Boolean = false,
    val isSyncing: Boolean = false,
    val errorMessage: String? = null
)

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val repository: FinanceRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()

    init {
        loadDashboardData()
    }

    private fun loadDashboardData() {
        viewModelScope.launch {
            combine(
                repository.getAllIncomes(),
                repository.getAllExpenses(),
                repository.getDebtsByType("DEBT"),
                repository.getDebtsByType("RECEIVABLE")
            ) { incomes, expenses, debts, receivables ->
                val incomeSum = incomes.sumOf { it.amount }
                val expenseSum = expenses.sumOf { it.amount }
                val debtSum = debts.filter { it.status != "PAID" }.sumOf { it.totalAmount - it.paidAmount }
                val receivableSum = receivables.filter { it.status != "PAID" }.sumOf { it.totalAmount - it.paidAmount }

                DashboardUiState(
                    currentBalance = incomeSum - expenseSum,
                    totalIncome = incomeSum,
                    totalExpense = expenseSum,
                    netProfit = incomeSum - expenseSum,
                    totalDebt = debtSum,
                    totalReceivable = receivableSum,
                    isLoading = false
                )
            }.collect { newState ->
                _uiState.value = newState
            }
        }
    }

    fun triggerGoogleSheetsSync() {
        viewModelScope.launch {
            _uiState.update { it.copy(isSyncing = true) }
            val result = repository.syncUnsyncedRecordsWithGoogleSheets()
            _uiState.update {
                it.copy(
                    isSyncing = false,
                    errorMessage = if (result.isFailure) result.exceptionOrNull()?.message else null
                )
            }
        }
    }
}`,
  },
  {
    filename: 'GoogleSheetsSyncWorker.kt',
    category: 'Sync & Worker',
    language: 'kotlin',
    description: 'WorkManager CoroutineWorker for reliable background Google Sheets replication',
    code: `package com.creatorfinance.app.sync

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.creatorfinance.app.domain.repository.FinanceRepository
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@HiltWorker
class GoogleSheetsSyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted workerParams: WorkerParameters,
    private val repository: FinanceRepository
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            val syncResult = repository.syncUnsyncedRecordsWithGoogleSheets()
            if (syncResult.isSuccess) {
                Result.success()
            } else {
                if (runAttemptCount < 3) {
                    Result.retry()
                } else {
                    Result.failure()
                }
            }
        } catch (e: Exception) {
            Result.retry()
        }
    }

    companion object {
        const val WORK_NAME = "google_sheets_sync_work"
    }
}`,
  },
  {
    filename: 'Theme.kt',
    category: 'Config & DI',
    language: 'kotlin',
    description: 'Material Design 3 Theme configuration with 16dp shapes & fintech palette',
    code: `package com.creatorfinance.app.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

// Modern Fintech Palette
val PrimaryBlue = Color(0xFF2563EB)
val PrimaryBlueDark = Color(0xFF1D4ED8)
val SuccessGreen = Color(0xFF10B981)
val WarningAmber = Color(0xFFF59E0B)
val DangerRed = Color(0xFFEF4444)

val LightColorScheme = lightColorScheme(
    primary = PrimaryBlue,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFDBEAFE),
    onPrimaryContainer = Color(0xFF1E40AF),
    secondary = SuccessGreen,
    surface = Color(0xFFF8FAFC),
    onSurface = Color(0xFF0F172A),
    background = Color(0xFFF8FAFC),
    error = DangerRed
)

val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF60A5FA),
    onPrimary = Color(0xFF0F172A),
    primaryContainer = Color(0xFF1E3A8A),
    onPrimaryContainer = Color(0xFFBFDBFE),
    secondary = SuccessGreen,
    surface = Color(0xFF0F172A),
    onSurface = Color(0xFFF1F5F9),
    background = Color(0xFF020617),
    error = DangerRed
)

val Shapes = Shapes(
    small = RoundedCornerShape(8.dp),
    medium = RoundedCornerShape(16.dp), // Required 16dp rounded corners
    large = RoundedCornerShape(24.dp),
    extraLarge = RoundedCornerShape(32.dp)
)

@Composable
fun CreatorFinanceTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        shapes = Shapes,
        content = content
    )
}`,
  },
  {
    filename: 'AndroidManifest.xml',
    category: 'Config & DI',
    language: 'xml',
    description: 'APK-ready Android Manifest with permissions, BiometricPrompt, and WorkManager provider',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Essential Network & Sync Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Security & Biometrics -->
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />

    <!-- Scheduled Notification & WorkManager -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:name=".CreatorFinanceApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.CreatorFinance">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.CreatorFinance"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
</manifest>`,
  },
  {
    filename: 'build.gradle.kts',
    category: 'Config & DI',
    language: 'kotlin',
    description: 'App level Gradle build script with Room, Compose, Hilt, and WorkManager',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.ksp)
    alias(libs.plugins.hilt.android)
}

android {
    namespace = "com.creatorfinance.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.creatorfinance.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildFeatures {
        compose = true
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.navigation.compose)

    // Room Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Hilt Dependency Injection
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.androidx.hilt.navigation.compose)
    implementation(libs.androidx.hilt.work)

    // WorkManager Background Sync
    implementation(libs.androidx.work.runtime.ktx)

    // Google Play Services & Sheets API
    implementation(libs.play.services.auth)
    implementation(libs.google.api.services.sheets)
    implementation(libs.google.api.client.android)
}`,
  },
];
