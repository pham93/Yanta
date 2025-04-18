import { redirect, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Yanta" },
    {
      name: "Yet Another Notetaking App",
      content: "Yet Another Notetaking App",
    },
  ];
};

export async function loader() {
  return redirect("/home");
}

export default function Index() {}
