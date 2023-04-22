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
  let response = { data: {}, errors: {} };
  try {
    /** This requires the Clerk withClerkMiddleware see middleware.ts */
    const { getToken } = getAuth(ctx.req);
    const token = await getToken({
      template: "grafbase",
    });
    if (!token) {
      console.warn("No token found", token);
    }

    response = token
      ? await fetchData(token)
      : { data: {}, errors: { message: "No token" } };
  } catch (e) {
    console.error(e);
    response.errors = { message: "Error fetching data" };
  }
  return {
    props: {
      ...buildClerkProps(ctx.req),
      initialData: response,
    },
  };
};

type SchemaPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SchemaPage = ({ initialData }: SchemaPageProps) => {
  const [data, setData] = useState<{ data: unknown; errors: unknown }>();
  const { getToken } = useAuth();

  const getData = async () => {
    const token = await getToken({
      template: "grafbase",
    });
    if (!token) {
      setData({ data, errors: { message: "No token found" } });
      return;
    }
    await fetchData(token).then(({ data, errors }) =>
      setData({ data, errors })
    );
  };

  return (
    <div>
      <h2>Server Side</h2>
      <pre>{JSON.stringify({ ...initialData }, null, 2)}</pre>
      <button onClick={getData}>Fetch data</button>
      <h2>Client Side</h2>
      <pre>{JSON.stringify({ ...data }, null, 2)}</pre>
    </div>
  );
};

export default SchemaPage;
