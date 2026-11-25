import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  CheckCircle2,
  Clock,
  Search,
  Sliders,
  Store,
  Users,
} from 'lucide-react';
import { DEMO_RESTAURANTS } from '../../data/demoRestaurants';
import { isCustomerInactive, isDemoCustomerEligible } from '../../utils/calculations';
import { formatIndianNumber, formatINR } from '../../utils/formatting';

type StatusFilter = 'all' | 'active' | 'inactive';
type SortField = 'lastVisit' | 'totalSpend';
type SortDir = 'asc' | 'desc';
type DateRange = '30d' | '90d';

export function DashboardDemoSection() {
  const [restaurantId, setRestaurantId] = useState(DEMO_RESTAURANTS[0].id);
  const [threshold, setThreshold] = useState(21);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('lastVisit');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const restaurant = useMemo(
    () => DEMO_RESTAURANTS.find((r) => r.id === restaurantId) ?? DEMO_RESTAURANTS[0],
    [restaurantId],
  );

  const stats = useMemo(() => {
    const total = restaurant.customers.length;
    const inactive = restaurant.customers.filter((c) =>
      isCustomerInactive(c.daysSinceLastVisit, threshold),
    ).length;
    const active = total - inactive;
    const eligible = restaurant.customers.filter(
      (c) => isDemoCustomerEligible(c, threshold).isEligible,
    ).length;

    const timeline = restaurant.ordersTimeline[dateRange];
    const totalOrders = timeline.reduce((sum, d) => sum + d.orders, 0);
    const totalRevenue = timeline.reduce((sum, d) => sum + d.revenue, 0);

    return { total, active, inactive, eligible, totalOrders, totalRevenue, timeline };
  }, [restaurant, threshold, dateRange]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return restaurant.customers
      .filter((c) => {
        const inactive = isCustomerInactive(c.daysSinceLastVisit, threshold);
        if (statusFilter === 'active' && inactive) return false;
        if (statusFilter === 'inactive' && !inactive) return false;
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.usualOrder.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const val =
          sortField === 'lastVisit'
            ? a.daysSinceLastVisit - b.daysSinceLastVisit
            : a.totalSpend - b.totalSpend;
        return sortDir === 'asc' ? val : -val;
      });
  }, [restaurant.customers, threshold, searchQuery, statusFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  return (
    <section
      id="live-demo"
      aria-labelledby="dashboard-demo-heading"
      className="relative py-24 sm:py-32 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/35"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/40 bg-[var(--accent-tint)] px-3.5 py-1 text-xs font-mono-data text-[var(--accent-primary)]">
              <BarChart3 className="h-3.5 w-3.5" />
              Interactive demo — illustrative data only
            </div>
            <h2
              id="dashboard-demo-heading"
              className="font-display text-section-display font-bold text-[var(--text-primary)]"
            >
              Inside your restaurant&apos;s retention dashboard.
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">
              Switch fictional restaurants, adjust the inactivity rule (default &gt; 21 days), and
              explore how Revist segments guests without connecting to any live database.
            </p>
          </div>

          {/* Restaurant Selector & Date Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-primary)] px-3.5 py-2">
              <Store className="h-4 w-4 text-[var(--accent-primary)]" />
              <label htmlFor="demo-restaurant-select" className="sr-only">
                Select fictional demo restaurant
              </label>
              <select
                id="demo-restaurant-select"
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="bg-transparent text-sm font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
              >
                {DEMO_RESTAURANTS.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-1"
              role="group"
              aria-label="Date range filter"
            >
              {(['30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setDateRange(range)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-mono-data transition-colors cursor-pointer ${
                    dateRange === range
                      ? 'bg-[var(--accent-primary)] text-[#04120a] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {range === '30d' ? 'Last 30 days' : 'Last 90 days'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Dashboard Frame */}
        <div className="rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-primary)] p-5 sm:p-8 shadow-[0_32px_90px_rgba(0,0,0,0.28)] space-y-8">
          {/* Top Threshold Controller + KPI Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Inactivity Rule Slider */}
            <div className="lg:col-span-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono-data uppercase tracking-wider text-[var(--accent-primary)]">
                    <Sliders className="h-3.5 w-3.5" />
                    Inactivity Threshold Rule
                  </span>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Inactive when days since last visit is strictly greater than{' '}
                    <strong className="text-[var(--text-primary)]">{threshold} days</strong>.
                  </p>
                </div>
                <span className="rounded-xl border border-[var(--accent-primary)]/40 bg-[var(--accent-tint)] px-3 py-1 font-mono-data text-base font-bold text-[var(--accent-primary)] tabular-nums">
                  &gt; {threshold}d
                </span>
              </div>

              <div className="space-y-2">
                <label htmlFor="demo-threshold-slider" className="sr-only">
                  Adjust inactivity threshold in days
                </label>
                <input
                  id="demo-threshold-slider"
                  type="range"
                  min={7}
                  max={60}
                  step={1}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="revist-slider"
                />
                <div className="flex justify-between font-mono-data text-[11px] text-[var(--text-muted)]">
                  <span>7 days</span>
                  <button
                    type="button"
                    onClick={() => setThreshold(21)}
                    className="underline hover:text-[var(--accent-primary)] cursor-pointer"
                  >
                    Default: 21d
                  </button>
                  <span>60 days</span>
                </div>
              </div>
            </div>

            {/* KPI Strip */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                  Total Guests
                </span>
                <div className="mt-2 font-display text-2xl sm:text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                  {stats.total}
                </div>
                <span className="text-[11px] font-mono-data text-[var(--text-muted)]">
                  Sample dataset
                </span>
              </div>

              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                  Active (&le; {threshold}d)
                </span>
                <div className="mt-2 font-display text-2xl sm:text-3xl font-bold tabular-nums text-[var(--accent-primary)]">
                  {stats.active}
                </div>
                <span className="text-[11px] font-mono-data text-[var(--text-muted)]">
                  {Math.round((stats.active / stats.total) * 100)}% of sample
                </span>
              </div>

              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[var(--warning-amber)]" />
                  Inactive (&gt; {threshold}d)
                </span>
                <div className="mt-2 font-display text-2xl sm:text-3xl font-bold tabular-nums text-[var(--warning-amber)]">
                  {stats.inactive}
                </div>
                <span className="text-[11px] font-mono-data text-[var(--text-muted)]">
                  {stats.eligible} pass eligibility rules
                </span>
              </div>

              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                <span className="text-xs text-[var(--text-muted)]">Demo Revenue ({dateRange})</span>
                <div className="mt-2 font-display text-xl sm:text-2xl font-bold tabular-nums text-[var(--text-primary)]">
                  {formatINR(stats.totalRevenue)}
                </div>
                <span className="text-[11px] font-mono-data text-[var(--text-muted)]">
                  {formatIndianNumber(stats.totalOrders)} orders
                </span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                    Illustrative Order &amp; Revenue Trend
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Order-level analytics require order data beyond a basic contact CSV.
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border-subtle)] px-2.5 py-0.5 font-mono-data text-[10px] text-[var(--text-muted)]">
                  Fictional order dataset
                </span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.timeline} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revistRevenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis
                      dataKey="dateLabel"
                      stroke="var(--text-muted)"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="var(--text-muted)"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v: number) => `₹${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-strong)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                      }}
                      formatter={(val: number, name: string) => [
                        name === 'revenue' ? formatINR(val) : formatIndianNumber(val),
                        name === 'revenue' ? 'Illustrative Revenue' : 'Demo Orders',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--accent-primary)"
                      strokeWidth={2.4}
                      fillOpacity={1}
                      fill="url(#revistRevenueFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                    Top Dishes (Demo Orders)
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {restaurant.cuisineLabel}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border-subtle)] px-2.5 py-0.5 font-mono-data text-[10px] text-[var(--text-muted)]">
                  Illustrative
                </span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={restaurant.topDishes}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                    <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={130}
                      stroke="var(--text-secondary)"
                      fontSize={11}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-strong)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                      }}
                      formatter={(val: number) => [`${val} demo orders`, 'Orders']}
                    />
                    <Bar dataKey="orders" fill="var(--accent-primary)" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Interactive Customer Table */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                  Customer Segmentation Explorer (Fictional Records · No Real Phone Numbers)
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Notice how a customer at Day 21 stays Active under the default rule, while Day 22
                  becomes Inactive.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guest or dish..."
                    aria-label="Search fictional customers"
                    className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] pl-8 pr-4 py-1.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none"
                  />
                </div>

                <div className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-0.5">
                  {(['all', 'active', 'inactive'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      type="button"
                      onClick={() => setStatusFilter(filterKey)}
                      className={`rounded-full px-3 py-1 text-xs capitalize transition-colors cursor-pointer ${
                        statusFilter === filterKey
                          ? 'bg-[var(--accent-primary)] text-[#04120a] font-semibold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {filterKey}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-xs font-mono-data uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="py-3 pr-4">Guest (Demo ID)</th>
                    <th className="py-3 pr-4">Usual Order</th>
                    <th className="py-3 pr-4">
                      <button
                        type="button"
                        onClick={() => toggleSort('lastVisit')}
                        className="inline-flex items-center gap-1 hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        Last Visit
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="py-3 pr-4">
                      <button
                        type="button"
                        onClick={() => toggleSort('totalSpend')}
                        className="inline-flex items-center gap-1 hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        Total Spend
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="py-3 pr-4">Activity Status</th>
                    <th className="py-3">Messaging Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]/60">
                  {filteredCustomers.map((customer) => {
                    const evalResult = isDemoCustomerEligible(customer, threshold);
                    return (
                      <tr key={customer.id} className="hover:bg-[var(--bg-primary)]/45">
                        <td className="py-3.5 pr-4">
                          <div className="font-medium text-[var(--text-primary)]">
                            {customer.name}
                          </div>
                          <div className="font-mono-data text-[11px] text-[var(--text-muted)]">
                            {customer.id}
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 text-xs text-[var(--text-secondary)]">
                          {customer.usualOrder}
                        </td>
                        <td className="py-3.5 pr-4 font-mono-data text-xs text-[var(--text-primary)]">
                          {customer.daysSinceLastVisit}d ago
                        </td>
                        <td className="py-3.5 pr-4 font-mono-data text-xs text-[var(--text-primary)]">
                          {formatINR(customer.totalSpend)}
                        </td>
                        <td className="py-3.5 pr-4">
                          {evalResult.isInactive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--warning-amber)]/40 bg-[var(--warning-tint)] px-2.5 py-0.5 text-xs font-medium text-[var(--warning-amber)]">
                              <Clock className="h-3 w-3" />
                              Inactive
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-primary)]/40 bg-[var(--accent-tint)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent-primary)]">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-xs">
                          {evalResult.isEligible ? (
                            <span className="font-medium text-[var(--accent-primary)]">
                              Eligible (Opted-in · Cooldown clear)
                            </span>
                          ) : customer.optedOut ? (
                            <span className="inline-flex items-center gap-1 text-[var(--danger-rose)]">
                              <AlertTriangle className="h-3 w-3" />
                              Excluded (STOP)
                            </span>
                          ) : !customer.optedIn ? (
                            <span className="text-[var(--text-muted)]">No opt-in consent</span>
                          ) : customer.lastReminderDaysAgo !== null &&
                            customer.lastReminderDaysAgo < 30 ? (
                            <span className="text-[var(--text-muted)]">
                              Reminded {customer.lastReminderDaysAgo}d ago (&lt;30d limit)
                            </span>
                          ) : (
                            <span className="text-[var(--text-muted)]">Active visitor</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-3">
              {filteredCustomers.map((customer) => {
                const evalResult = isDemoCustomerEligible(customer, threshold);
                return (
                  <div
                    key={customer.id}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-sm text-[var(--text-primary)]">
                          {customer.name}
                        </div>
                        <div className="font-mono-data text-[11px] text-[var(--text-muted)]">
                          {customer.id} · {customer.usualOrder}
                        </div>
                      </div>
                      {evalResult.isInactive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning-tint)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--warning-amber)]">
                          <Clock className="h-3 w-3" />
                          Inactive
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-tint)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent-primary)]">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono-data text-[var(--text-secondary)]">
                      <span>Last visit: {customer.daysSinceLastVisit}d ago</span>
                      <span>{formatINR(customer.totalSpend)}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {evalResult.isEligible
                        ? 'Eligible for WhatsApp campaign'
                        : evalResult.reasons[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCustomers.length === 0 && (
              <p className="py-6 text-center text-sm text-[var(--text-muted)]">
                No fictional guest records match your current search or filter.
              </p>
            )}
          </div>

          <p className="text-center text-xs text-[var(--text-muted)]">
            Interactive demo — illustrative data only. Does not connect to live restaurant databases
            or display unverified delivery/return attribution reports.
          </p>
        </div>
      </div>
    </section>
  );
}
