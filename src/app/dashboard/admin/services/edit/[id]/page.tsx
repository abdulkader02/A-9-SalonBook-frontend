import EditServiceClient from "./EditServiceClient"

const EditServicePage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  return <EditServiceClient serviceId={id} />
}

export default EditServicePage