
import { getSession } from "../_components/auth";
import PermanentDrawerLeft from "../_components/sidebar";
import Logout from "../_components/logout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    return <div>User Doesnt exist</div>
  }
  if (!session?.admin.length) {
    return <>

      <div style={
        { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
      }> <div>
          <div style={{ fontSize: '24px', lineHeight: '42px' }}>You dont have any projects assigned.&nbsp;
            <a href='mailto: customercare@utilfacts.com'>reach out to customercare@utilfacts.com</a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Logout></Logout>
          </div>

        </div>
      </div>


    </>
  }
  const routes = [
    {
      name: "Dashboard",
      redirectTo: "/dashboard",
      default: true
    },
    {
      name: "Bills",
      redirectTo: "/dashboard/bills",

    },
    {
      name: "Reports",
      redirectTo: "/dashboard/reports",
    },
    {
      name: "Trends",
      redirectTo: "/dashboard/trends",
      disabled: true,
    },
    {
      name: "Network",
      redirectTo: "/dashboard/network",
      disabled: true,
    },
    {
      name: "Live Data",
      redirectTo: "/dashboard/liveData",
      disabled: false,
    },
    {
      name: "Payments",
      redirectTo: "/dashboard/payments",
    },
    {
      name: "Settings",
      redirectTo: "/dashboard/settings",
    },
  ];

  return <PermanentDrawerLeft list={routes}> {children}</PermanentDrawerLeft>;
}
