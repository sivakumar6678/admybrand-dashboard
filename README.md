# 🧠 ADmyBRAND Insights - AI-Powered Analytics Dashboard

A cutting-edge, interactive analytics dashboard built with **React 19**, **Vite**, and **shadcn/ui**. Features AI-powered insights, draggable grid layout, advanced date filtering, real-time updates, and a beautiful dark/light mode toggle.

## 🚀 Advanced Features

### 🎛️ Interactive Grid Layout
- **Drag & Drop**: Rearrange dashboard widgets by dragging
- **Resizable Widgets**: Adjust component sizes with resize handles
- **Layout Persistence**: Your customizations save automatically
- **Responsive Breakpoints**: Adapts to all screen sizes (12→10→6→4→2 columns)

### 📅 Smart Date Filtering
- **Global Filtering**: One date range affects all dashboard data
- **Quick Presets**: Last 7/30/90 Days, This/Last Month
- **Custom Ranges**: Select any start and end date
- **Real-time Updates**: All charts and data update instantly

### 🧠 AI-Powered Insights
- **Smart Analysis**: Click "🧠 Generate Insights" for AI analysis
- **Dynamic Content**: Insights generated from your actual data
- **Professional Formatting**: Color-coded sections with emojis
- **Actionable Recommendations**: Specific next steps for growth

### 📊 Core Dashboard
- **4 KPI Cards**: Revenue, Users, Conversion Rate, Growth %
- **Real-time Updates**: Live data simulation every 30 seconds
- **Interactive Charts**: Line, Bar, and Donut charts with Recharts
- **Advanced Data Table**: Sorting, filtering, and search
- **Pagination**: Configurable items per page (5, 10, 20, 50)
- **Export**: PDF and CSV export functionality
- **Loading States**: Beautiful skeleton loading animations

### 🎨 UI/UX Design
- **Modern Design System**: Consistent, accessible component library
- **Dark/Light Mode**: Seamless theme switching with animations
- **Smooth Interactions**: 60fps animations and hover effects
- **Professional Aesthetics**: Clean layout with proper spacing
- **Mobile-First**: Responsive design for all devices

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit: `http://localhost:5173`

## 📁 Clean Project Structure

```
src/
├── components/
│   ├── advanced/              # Advanced feature components
│   │   ├── date-range-picker.jsx
│   │   └── smart-insights-modal.jsx
│   ├── ui/                    # Reusable UI components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   └── table.jsx
│   ├── MetricCard.jsx         # KPI metric cards
│   ├── LineChart.jsx          # Revenue trends
│   ├── BarChart.jsx           # Channel performance
│   ├── DonutChart.jsx         # User distribution
│   ├── DataTable.jsx          # Advanced data table
│   └── DarkModeToggle.jsx     # Theme switcher
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
