import AdminContentPage from "../content-page";

export default function AdminCoursePage({ searchParams }: { searchParams: Promise<{ cohort?: string; status?: string }> }) {
  return <AdminContentPage searchParams={searchParams} type="course" />;
}
