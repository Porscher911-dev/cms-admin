import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // We will read the JSON stores to generate analytics
    const projectStore = await prisma.store.findUnique({ where: { key: 'projects' } });
    const financeStore = await prisma.store.findUnique({ where: { key: 'finance' } });

    const projects = projectStore ? JSON.parse(projectStore.value) : [];
    const finance = financeStore ? JSON.parse(financeStore.value) : [];

    // Calculate Project Status Distribution
    const projectStatusMap: Record<string, number> = {};
    projects.forEach((p: any) => {
      const status = p.status || 'Khác';
      projectStatusMap[status] = (projectStatusMap[status] || 0) + 1;
    });
    const projectStatusData = Object.keys(projectStatusMap).map(key => ({
      name: key,
      value: projectStatusMap[key]
    }));

    // Calculate Monthly Financials (Revenue vs Expenses)
    let totalRevenue = 0;
    let totalExpenses = 0;
    
    finance.forEach((t: any) => {
      const val = typeof t.amount === 'number' ? t.amount : (parseInt(t.amount?.toString().replace(/\D/g, '')) || 0);
      if (t.type === 'THU') {
        totalRevenue += val;
      } else if (t.type === 'CHI') {
        totalExpenses += val;
      }
    });

    // Generate 6 months trend data (Mocked trend based on current totals for demo)
    const currentMonth = new Date().getMonth();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const financialTrend = [];
    for (let i = 5; i >= 0; i--) {
      let mIndex = currentMonth - i;
      if (mIndex < 0) mIndex += 12;
      
      // randomize slightly for realistic chart
      const noise = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      financialTrend.push({
        name: months[mIndex],
        revenue: i === 0 ? totalRevenue : Math.floor(totalRevenue * noise),
        profit: i === 0 ? (totalRevenue - totalExpenses) : Math.floor((totalRevenue - totalExpenses) * noise), // Dashboard chart needs 'profit' key
        expenses: i === 0 ? totalExpenses : Math.floor(totalExpenses * noise),
      });
    }

    return NextResponse.json({
      projectStatusData,
      financialTrend,
      summary: {
        totalProjects: projects.length,
        totalRevenue,
        totalExpenses
      }
    });
  } catch (err) {
    console.error('API GET analytics error:', err);
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 });
  }
}
