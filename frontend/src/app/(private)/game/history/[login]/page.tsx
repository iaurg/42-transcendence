export default function Page({ params }: { params: { login: string } }) {
  return <div>User History: {params.login}</div>;
}
