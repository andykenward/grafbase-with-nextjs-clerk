import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

const query = /* GraphQL */ `
  {
    postCollection(first: 100) {
      edges {
        node {
          id
          title
          comments {
            edges {
              node {
                id
                message
              }
            }
          }
        }
      }
    }
  }
`;

const fetchData = async (token: string) =>
  fetch(`${process.env.NEXT_PUBLIC_GRAFBASE_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  }).then((res) => res.json());

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  /** This requires the Clerk withClerkMiddleware see middleware.ts */
  const { getToken } = getAuth(ctx.req);
  const token = await getToken({
    template: "grafbase",
  });
  if (!token) {
    console.warn("No token found", token);
  }

  const response = token ? await fetchData(token) : { data: {} };

  return {
    props: {
      ...buildClerkProps(ctx.req),
      initialData: response.data,
    },
  };
};

type SchemaPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SchemaPage = ({ initialData }: SchemaPageProps) => {
  const [data, setData] = useState();
  const { getToken } = useAuth();

  const getData = async () => {
    const token = await getToken({
      template: "grafbase",
    });
    if (!token) {
      console.warn("No token found", token);
      return;
    }
    await fetchData(token).then(({ data }) => setData(data));
  };

  return (
    <div>
      <h2>Server Side</h2>
      <pre>{JSON.stringify({ data: initialData }, null, 2)}</pre>
      <button onClick={getData}>Fetch data</button>
      <h2>Client Side</h2>
      <pre>{JSON.stringify({ data }, null, 2)}</pre>
    </div>
  );
};

export default SchemaPage;
