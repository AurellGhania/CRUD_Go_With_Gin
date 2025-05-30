import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import { useUserProfile } from "../../hooks/user-crud/useUserProfile";
import UserAndProductMetric from "../../components/ecommerce/UserAndProductMetric.tsx";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart.tsx";
import StatisticsChart from "../../components/ecommerce/StatisticsChart.tsx";
import DemographicCard from "../../components/ecommerce/DemographicCard.tsx";
import RecentOrders from "../../components/ecommerce/RecentOrders.tsx";

export default function Home() {
      useUserProfile(); // ini akan auto jalan saat komponen mount
      const [username, setUsername] = useState("");
  
      useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }
      }, []);
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
            <p className="text-gray-900 text-7xl dark:text-white mb-10">Helloo {username}!</p>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <UserAndProductMetric />
          <EcommerceMetrics />

        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <MonthlySalesChart />

        </div>
        
        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
