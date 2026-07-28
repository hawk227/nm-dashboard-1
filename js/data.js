// Mock data for the dashboard. In a real app this would come from an API;
// it's centralized here so render code stays free of literals.

export const sidebarNav = [
  { label: 'Dashboard Analytics', icon: 'layout-grid' },
  { label: 'Online Users', icon: 'users' },
  { label: 'Radius Logs', icon: 'list' },
  { label: 'OLT Status', icon: 'server' },
  { label: 'Network Map', icon: 'map' },
  { label: 'Customers', icon: 'users', expandable: true },
  { label: 'Managers', icon: 'list' },
  { label: 'NAS', icon: 'server' },
  { label: 'Profiles', icon: 'map' },
  { label: 'Packages', icon: 'users' },
  { label: 'Ticket', icon: 'triangle-alert', hasChevron: true },
];

export const customerSubmenu = [
  { label: 'Customers', icon: 'user' },
  { label: 'Online Users', icon: 'wifi' },
  { label: 'Due Customers', icon: 'triangle-alert' },
  { label: 'Extend Expiry Date', icon: 'clock' },
  { label: 'Transfer Customer', icon: 'arrow-left-right' },
  { label: 'Import from MikroTik', icon: 'download' },
];

export const chipIcons = {
  card: 'credit-card',
  wallet: 'wallet',
  clock: 'clock',
  user: 'user',
};

// [label, value, delta text, delta tone, footnote]
export const topStats = [
  ["Today's Collection", '৳600', '^ ৳320 today', 'good', 'July 1 – July 5, 2026'],
  ['Outstanding Dues', '৳5,560', 'v 12 overdue', 'bad', 'July 1 – July 5, 2026'],
  ['Bill Paid Clients', '294 / 495', '^ 59%', 'good', '201 clients not paid'],
  ['Cash Due', '৳5,560', 'v 12 overdue', 'bad', '12 clients owe cash'],
];

// [label, value, inline tone, inline text, footnote tone, footnote text]
export const clientSegments = [
  ['Active', '294', 'good', '^ 59%', '', 'of total clients'],
  ['Online', '221', 'blue', '^ 74%', '', 'of active clients'],
  ['New', '2', 'good', 'this month', '', 'July 2026'],
  ['Renewed', '47', 'teal', 'this month', '', 'July 2026'],
  ['Offline', '73', '', '', 'yellow', 'v 6 vs yesterday'],
  ['Expired', '201', '', '', 'red', '৳201K recovery potential'],
  ['Waiver', '40', '', '', '', 'active discounts'],
  ['Deactivated', '0', '', '', 'good', 'All clear ✓'],
];

export const financialOverview = [
  ['Total Distribution', '৳324,730', ''],
  ['Remaining Balance', '৳129,813', ''],
  ['Total Received', '৳313,110', 'green'],
  ['Payable Due', '৳0', 'muted'],
  ['Receivable Due', '৳4,400', 'green'],
  ['Total Purchased', '৳0', 'muted'],
  ['Total Cost', '৳0', 'muted'],
  ['Total MFS Profit', '৳312,200', 'green'],
  ["Today's Bandwidth", '0.00 GB', ''],
];

export const collectionProfit = [
  ['card', 'Cash Collections', '৳600.00', 'Customer renewal', ''],
  ['wallet', 'Wallet Collections', '৳25,150.00', 'Wallet payments', 'green'],
  ['clock', 'Due Cash', '৳4,300.00', 'Due collections', ''],
  ['user', 'Reselling', '৳0.00', 'No activity yet', 'muted'],
];

export const profitBreakdown = [
  ['Cash Collections', 'Customer Cash Received (Renewal)', '৳600.00', 'Net Cash Profit', '৳600.00', 'blue', 'card'],
  ['Wallet Collections', 'Customer Wallet Payment (Renewal)', '৳36,350.00', 'Net Wallet Profit', '৳36,350.00', 'green', 'wallet'],
  ['Due Cash Collections', 'Customer Due Cash (Renewal)', '৳5,700.00', 'Net Due Cash Profit', '৳5,700.00', 'blue', 'clock'],
  ['Manager Collections', 'Manager Sales Revenue', '৳0.00', 'Manager Net Profit', '৳0.00', '', 'user'],
];

export const topBandwidthCustomers = [
  ['ANM2017', '1608.66 GB', '#6b8cf0', 90],
  ['ANM2185', '1532.56 GB', '#56b8e4', 86],
  ['ANM2138', '1310.74 GB', '#4dd0b5', 74],
  ['ANM2260', '1290.52 GB', '#ffbd46', 73],
  ['ANM2211', '1194.36 GB', '#ff8d7a', 68],
  ['ANM2080', '1094.10 GB', '#6d8ff0', 63],
  ['ANM2227', '1073.17 GB', '#55b9e4', 62],
  ['ANM2114', '1062.00 GB', '#50d0b6', 61],
  ['ANM2095', '1034.52 GB', '#ffbd46', 59],
  ['ANM2148', '1012.16 GB', '#ff8d7a', 57],
];

export const attentionGroups = [
  ['Expiring soon', 'yellow', [
    ['ANM2017', '10 Mbps · 1d left', 'Renew'],
    ['ANM2185', '20 Mbps · 2d left', 'Renew'],
    ['ANM2138', '10 Mbps · 3d left', 'Renew'],
  ]],
  ['Overdue', 'red', [
    ['ANM2260', 'Due: ৳850.00', 'Remind'],
    ['ANM2211', 'Due: ৳1,200.00', 'Remind'],
  ]],
  ['Pending activation', 'blue', [
    ['ANM2301', 'Waiting 2 days ago', 'Activate'],
  ]],
];

// Peak Hours Analysis chart samples (24 hourly buckets).
export const peakHoursChart = {
  download: [380, 260, 120, 480, 750, 480, 420, 310, 340, 1300, 2600, 1650, 1200, 1130, 1310, 1500, 730, 390, 1330, 1020, 1360, 1320, 870, 390],
  upload: [0, 0, 0, 70, 0, 150, 90, 0, 100, 360, 900, 520, 390, 300, 420, 360, 260, 0, 480, 330, 440, 380, 220, 70],
  sessions: [470, 360, 160, 510, 1220, 570, 500, 360, 310, 1300, 2950, 1800, 1400, 1200, 1400, 1650, 830, 390, 1420, 1040, 1350, 1300, 820, 460],
};

// The app's "current time". Every expiry/status label is derived from this so
// the list and detail views can never disagree about whether an account is
// live (they used to: the detail page hard-coded "Active" for expired rows).
export const TODAY = new Date(2026, 6, 28, 10, 0);

// Connection fields that are the same for every customer in this mock set.
// Per-customer values below override anything declared here.
const CONNECTION_DEFAULTS = {
  connectionType: 'STATIC_IP',
  bandwidthType: 'Shared',
  subnet: '255.255.255.252',
  zone: null,
  pool: null,
  downloadMbps: null,
  uploadMbps: null,
  durationDays: 30,
  initialFiberPower: null,
  cableLength: 0,
  cableId: null,
  wifiRouterUsername: null,
  wifiRouterPassword: null,
  ipPhoneNo: null,
  connectedNas: null,
  recentDb: null,
  bandwidth: null,
  manager: 'ISP Manager',
  managerEmail: 'admin@gmail.com',
  poc: {
    name: 'R2P4jolshamarket2',
    address: null,
    lat: null,
    lng: null,
    createdAt: new Date(2026, 6, 7, 11, 57),
  },
};

/**
 * `null` marks a genuinely unset field. Rendering code shows those greyed out
 * as "Not set" rather than printing the string "N/A" at full contrast, so real
 * data stands out from missing data.
 */
export const customers = [
  {
    ...CONNECTION_DEFAULTS,
    pppoe: 'static_1785143587529',
    password: 'static_1785143587529',
    clientId: '100192',
    name: 'Murad presidency_Home',
    profile: 'Static_Default',
    mobile: '01827517700',
    wallet: 0,
    due: 0,
    price: 1000,
    expiresAt: new Date(2026, 6, 27, 15, 13),
    joinedAt: new Date(2026, 6, 27, 15, 13),
    updatedAt: new Date(2026, 6, 27, 15, 13),
    lastOnline: null,
    address: 'Jolsha market… 6 tala…room number – 154 Chittagong.',
    lat: null,
    lng: null,
    onuMac: 'VSOL00997759',
    ip: '192.168.54.698',
    gateway: '192.168.54.697',
    fixedBillingCycle: false,
    history: { extensions: 0, invoices: 0, renewals: 0, withdrawals: 0, bandwidth: 0, onu: 0, analytics: 0 },
  },
  {
    ...CONNECTION_DEFAULTS,
    pppoe: 'static_1785133091400',
    password: 'Ar!7fq2_Ka9',
    clientId: '790565',
    name: 'Mr Aaraf',
    profile: 'Static_Default',
    mobile: '01837304505',
    wallet: 0,
    due: 850,
    price: 1000,
    expiresAt: new Date(2026, 6, 27, 12, 18),
    joinedAt: new Date(2026, 3, 12, 9, 30),
    updatedAt: new Date(2026, 6, 27, 12, 18),
    lastOnline: new Date(2026, 6, 27, 21, 42),
    address: 'House 42, Road 7, Dhanmondi, Dhaka.',
    lat: 23.7461,
    lng: 90.376,
    onuMac: 'VSOL00997760',
    ip: '192.168.54.702',
    gateway: '192.168.54.701',
    fixedBillingCycle: true,
    history: { extensions: 1, invoices: 4, renewals: 3, withdrawals: 0, bandwidth: 12, onu: 2, analytics: 1 },
  },
  {
    ...CONNECTION_DEFAULTS,
    pppoe: 'static_1785132933260',
    password: 'Gd#4mZ1_Rt8',
    clientId: '791618',
    name: 'RAJASTHAN GEC GODOWN_GEC(STATIC)',
    profile: 'Static_Default',
    mobile: '01821204943',
    wallet: 0,
    due: 0,
    price: 1000,
    expiresAt: new Date(2026, 6, 27, 12, 15),
    joinedAt: new Date(2026, 1, 3, 14, 5),
    updatedAt: new Date(2026, 6, 27, 12, 15),
    lastOnline: new Date(2026, 6, 26, 18, 3),
    address: 'GEC Circle, Chittagong.',
    lat: 22.3585,
    lng: 91.8214,
    onuMac: 'VSOL00997761',
    ip: '192.168.54.706',
    gateway: '192.168.54.705',
    fixedBillingCycle: false,
    history: { extensions: 0, invoices: 6, renewals: 5, withdrawals: 1, bandwidth: 30, onu: 4, analytics: 1 },
  },
  {
    ...CONNECTION_DEFAULTS,
    pppoe: 'static_1785131242306',
    password: 'Nb@8vC3_Ye5',
    clientId: '800490',
    name: 'Afroza(STATIC)',
    profile: 'Static_Default',
    mobile: '01812343100',
    wallet: 250,
    due: 1200,
    price: 1000,
    expiresAt: new Date(2026, 6, 27, 11, 47),
    joinedAt: new Date(2025, 10, 18, 10, 20),
    updatedAt: new Date(2026, 6, 27, 11, 47),
    lastOnline: new Date(2026, 6, 27, 8, 12),
    address: 'Lalkhan Bazar, Chittagong.',
    lat: 22.3419,
    lng: 91.8132,
    onuMac: 'VSOL00997762',
    ip: '192.168.54.710',
    gateway: '192.168.54.709',
    fixedBillingCycle: false,
    history: { extensions: 2, invoices: 9, renewals: 8, withdrawals: 2, bandwidth: 45, onu: 6, analytics: 1 },
  },
  {
    ...CONNECTION_DEFAULTS,
    pppoe: 'static_1785053777716',
    password: 'Qw$5tB7_Lm2',
    clientId: '568086',
    name: 'Alchemy Software _Biznet',
    profile: 'Static_Default',
    mobile: '01313406616',
    wallet: 3400,
    due: 0,
    price: 1000,
    expiresAt: new Date(2026, 7, 26, 14, 16),
    joinedAt: new Date(2025, 5, 1, 11, 0),
    updatedAt: new Date(2026, 6, 26, 14, 16),
    lastOnline: new Date(2026, 6, 28, 9, 51),
    address: 'Agrabad C/A, Chittagong.',
    lat: 22.3269,
    lng: 91.8043,
    onuMac: 'VSOL00997763',
    ip: '192.168.54.714',
    gateway: '192.168.54.713',
    fixedBillingCycle: true,
    history: { extensions: 1, invoices: 14, renewals: 13, withdrawals: 3, bandwidth: 90, onu: 8, analytics: 1 },
  },
];

/**
 * Actions the operator reaches for constantly — always visible, never buried.
 * `requiresWalletCover` marks an action that can't complete unless the wallet
 * covers the renewal price, so it can be disabled with a reason instead of
 * failing after the click.
 */
export const primaryActions = [
  { id: 'cash-renew', icon: 'refresh-cw', label: 'Cash Renew', variant: 'primary' },
  { id: 'wallet-renew', icon: 'wallet', label: 'Wallet Renew', variant: 'neutral', requiresWalletCover: true },
  { id: 'add-payment', icon: 'credit-card', label: 'Add Payment', variant: 'success' },
  { id: 'extend-expiry', icon: 'calendar', label: 'Extend Expiry', variant: 'neutral' },
  { id: 'create-ticket', icon: 'ticket', label: 'Create Ticket', variant: 'neutral' },
];

/**
 * Everything else, grouped by intent. `variant` encodes *consequence*, not
 * decoration: neutral = routine, success = money in, warning = reversible
 * risk, danger = destructive.
 */
export const actionGroups = [
  {
    title: 'Billing',
    icon: 'wallet',
    actions: [
      { id: 'wallet-withdraw', icon: 'wallet', label: 'Wallet Withdraw', variant: 'warning' },
      { id: 'adjust-due', icon: 'scale', label: 'Adjust Due', variant: 'warning' },
    ],
  },
  {
    title: 'Account',
    icon: 'user',
    actions: [
      { id: 'copy-customer', icon: 'copy', label: 'Duplicate', variant: 'neutral' },
      { id: 'change-pppoe', icon: 'id-card', label: 'Change PPPoE', variant: 'neutral' },
      { id: 'change-profile', icon: 'package', label: 'Change Profile', variant: 'neutral' },
    ],
  },
  {
    title: 'Danger zone',
    icon: 'triangle-alert',
    danger: true,
    actions: [
      { id: 'deactivate', icon: 'ban', label: 'Deactivate', variant: 'danger' },
      { id: 'left-client', icon: 'log-out', label: 'Mark as Left', variant: 'warning' },
      { id: 'delete', icon: 'trash-2', label: 'Delete User', variant: 'danger' },
    ],
  },
];
