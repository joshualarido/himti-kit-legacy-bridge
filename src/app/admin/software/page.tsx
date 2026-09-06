import AdminContentPage from "../content-page";

export default function AdminSoftwarePage({ searchParams }: { searchParams: Promise<{ cohort?: string; status?: string }> }) {
  return <AdminContentPage searchParams={searchParams} type="software" />;
}
