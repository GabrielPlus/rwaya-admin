import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import NextTopLoader from 'nextjs-toploader';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { storeId: string }
}) {
   const { userId } = auth();

   if (!userId) {
    redirect('/');
   }

   const store = await prismadb.store.findFirst({
    where: {
        id: params.storeId,
        userId
    }
   });

   if(!store) {
    redirect('/');
   }

   const stores = await prismadb.store.findMany({
    where: {
        userId,
    },
   });

   return (
    <>
        <NextTopLoader
          color="#3b82f6"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
        <SidebarProvider>
          <AppSidebar stores={stores} />
          <div className="flex-1">
            <Navbar />
            <main className="p-6">
              {children}
            </main>
          </div>
        </SidebarProvider>
    </>
   );
};