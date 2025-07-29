# Modern AI-Powered Analytics Dashboard

A highly responsive, modern analytics dashboard built with **React.js** and **shadcn/ui**. Features real-time data updates, interactive charts, advanced data tables, and a beautiful dark/light mode toggle.

## 🚀 Features

### 📊 Overview Dashboard
- **4 Summary Metric Cards**: Revenue, Users, Conversion Rate, Growth %
- **Real-time Updates**: Simulated live data updates every 30 seconds
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### 📈 Interactive Charts
- **Line Chart**: Revenue and user growth over time
- **Bar Chart**: User acquisition by marketing channel
- **Donut Chart**: User distribution by role
- **Responsive Charts**: Built with Recharts library

### 📋 Advanced Data Table
- **Sorting**: Click column headers to sort data
- **Filtering**: Search by name, filter by status and role
- **Pagination**: Configurable items per page (5, 10, 20, 50)
- **Export**: PDF and CSV export functionality
- **Loading States**: Beautiful skeleton loading animations

### 🎨 UI/UX Design
- **shadcn/ui Components**: Consistent, accessible design system
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Smooth Animations**: Hover effects and loading states
- **Visual Hierarchy**: Clean layout with proper spacing and typography
- **Mobile Responsive**: Works perfectly on all screen sizes

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui base components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── table.jsx
│   │   ├── input.jsx
│   │   ├── select.jsx
│   │   └── skeleton.jsx
│   ├── Dashboard.jsx          # Main dashboard layout
│   ├── MetricCard.jsx         # Summary metric cards
│   ├── LineChart.jsx          # Revenue line chart
│   ├── BarChart.jsx           # Channel bar chart
│   ├── DonutChart.jsx         # User role donut chart
│   ├── DataTable.jsx          # Advanced data table
│   └── DarkModeToggle.jsx     # Theme toggle button
├── context/
│   └── ThemeContext.jsx       # Dark/light mode context
├── mock/
│   └── metrics.json           # Mock data for all components
├── utils/
│   └── cn.js                  # Utility for className merging
├── App.jsx                    # Main app component
├── main.jsx                   # App entry point
└── index.css                  # Global styles with CSS variables
```

## 🛠️ Technologies Used

- **React 19.1.0** - Latest React with modern features
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icon library
- **jsPDF & PapaParse** - Export functionality
- **Radix UI** - Headless UI primitives

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173` or `http://localhost:5174`

### Build for Production

```bash
npm run build
```

## 🎯 Key Features Explained

### Real-time Updates
The dashboard simulates real-time data updates using `setInterval`. Metrics update every 30 seconds with realistic variations.

### Export Functionality
- **PDF Export**: Generates a formatted PDF report of the data table
- **CSV Export**: Downloads table data as a CSV file for spreadsheet analysis

### Advanced Filtering
- **Text Search**: Search across all table columns
- **Status Filter**: Filter by Active/Inactive users
- **Role Filter**: Filter by Admin, Manager, User, Guest roles
- **Combined Filters**: All filters work together seamlessly

### Responsive Design
- **Mobile First**: Designed for mobile devices first
- **Breakpoint System**: Tailored layouts for different screen sizes
- **Touch Friendly**: Optimized for touch interactions

### Dark Mode
- **System Preference**: Respects user's system theme preference
- **Manual Toggle**: Easy toggle button in the header
- **Persistent**: Remembers user's choice in localStorage
- **Smooth Transitions**: Animated theme switching

## 🎨 Customization

### Colors
Modify the CSS variables in `src/index.css` to change the color scheme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... other variables */
}
```

### Mock Data
Update `src/mock/metrics.json` to change the dashboard data.

## 📱 Mobile Optimization

- **Responsive Grid**: Adapts from 4 columns to 1 column on mobile
- **Touch Interactions**: Optimized button sizes and touch targets
- **Horizontal Scrolling**: Tables scroll horizontally on small screens
- **Collapsible Filters**: Filters stack vertically on mobile

---

**Built with ❤️ using React.js and shadcn/ui**
