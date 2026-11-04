import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { adminProject } from "@/lib/admin/data";
import { PageTitle, Panel } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/entity-form";

export const metadata = { title: "Edit project" };

export default async function ProjectEditPage({ params }: PageProps<"/admin/portfolio/[id]">) {
  const [{ id }, ctx] = await Promise.all([params, requireAdmin()]);
  const isNew = id === "new";
  if (isNew && ctx.mode === "demo") notFound();
  const project = isNew ? null : await adminProject(ctx, id);
  if (!isNew && !project) notFound();
  return (
    <>
      <PageTitle title={isNew ? "Add project" : project!.title} />
      <Panel><ProjectForm project={project} readOnly={ctx.mode === "demo"} /></Panel>
    </>
  );
}
