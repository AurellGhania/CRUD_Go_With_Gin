import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import { useUserProfile } from "../../hooks/user-crud/useUserProfile";

export default function LandingPage() {
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
      <div className="flex flex-col h-screen p-20">

      <p className="text-gray-900 text-7xl dark:text-white mb-10">Helloo {username}!</p>
      <p className="text-gray-900 text-6xl dark:text-white mb-10">Welcome To Landing Page!</p>

        <div className="grid grid-cols-12 gap-4 md:gap-6">

        

            <div className="col-span-12">
            <StatisticsChart />
            </div>

            <div className="col-span-12">
                <MonthlySalesChart />
            </div>

            <div className="col-span-12 xl:col-span-5">
            <DemographicCard />
            </div>

            <div className="col-span-12 xl:col-span-7">
            <RecentOrders />
            </div>
        </div>
      </div>

    </>
  );
}
