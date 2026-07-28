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

// [pppoeUsername, clientId, name, profile, mobile, walletBalance, expireDate, remainingDaysLabel, hasViewAction]
export const customers = [
  ['static_1785143587529', '100192', 'Murad_presidency_Home', 'Static_Default', '01827517700', '0', 'Jul 27, 2026, 03:13 PM', 'Expired (0d ago)', true],
  ['static_1785133091400', '790565', 'Mr Aaraf', 'Static_Default', '01837304505', '0', 'Jul 27, 2026, 12:18 PM', 'Expired (0d ago)', false],
  ['static_1785132933260', '791618', 'RAJASTHAN GEC GODOWN_GEC(STATIC)', 'Static_Default', '01821204943', '0', 'Jul 27, 2026, 12:15 PM', 'Expired (0d ago)', false],
  ['static_1785131242306', '800490', 'Afroza(STATIC)', 'Static_Default', '01812343100', '0', 'Jul 27, 2026, 11:47 AM', 'Expired (1d ago)', false],
  ['static_1785053777716', '568086', 'Alchemy Software _Biznet', 'Static_Default', '01313406616', '0', 'Jul 26, 2026, 02:16 PM', 'Expired (1d ago)', true],
];

// Filler fields shown on the Customer Details page (connection/profile/POC
// info) that aren't yet tracked per-row in the `customers` table above.
export const customerDetailFiller = {
  address: 'Jolsha market… 6 tala…room number – 154 Chittagong.',
  lat: '0, 0',
  onuMac: 'VSOL00997759',
  recentDb: 'N/A',
  bandwidth: 'N/A',
  ip: '192.168.54.698',
  gateway: '192.168.54.697',
  subnet: '255.255.255.252',
  zone: 'N/A',
  pool: 'N/A',
  download: 'N/A',
  upload: 'N/A',
  duration: '30 days',
  pocName: 'R2P4jolshamarket2',
  pocAddr: 'N/A',
  pocLat: 'N/A',
  pocLng: 'N/A',
  pocCreated: 'Jul 7, 2026, 11:57 AM',
};

// [groupTitle, groupIcon, [icon, label, colorTone][]]
export const quickActionGroups = [
  ['CUSTOMER', 'user', [
    ['pencil', 'Edit Customer', 'navy'],
    ['copy', 'Copy Customer', 'navy'],
    ['id-card', 'Change PPPOE Username', 'navy'],
    ['package', 'Change Profile', 'navy'],
  ]],
  ['RENEWAL', 'refresh-cw', [
    ['refresh-cw', 'Cash Renew (Collected)', 'green'],
    ['refresh-cw', 'Cash Renew (Not Collected)', 'navy'],
    ['credit-card', 'Wallet Renew', 'green'],
    ['calendar', 'Extend Expiry Date', 'navy'],
  ]],
  ['WALLET', 'wallet', [
    ['wallet', 'Add Wallet Payment', 'green'],
    ['wallet', 'Wallet Withdraw', 'amber'],
    ['scale', 'Adjust Due from Wallet', 'purple'],
  ]],
  ['STATUS', 'user', [
    ['ban', 'Deactivate', 'red'],
    ['log-out', 'Left Client', 'amber'],
  ]],
  ['COMMUNICATION', 'message-square', [
    ['ticket', 'Create Ticket', 'navy'],
    ['message-square', 'Send SMS', 'navy'],
  ]],
  ['DANGER ZONE', 'triangle-alert', [
    ['trash-2', 'Delete User', 'red'],
  ]],
];
