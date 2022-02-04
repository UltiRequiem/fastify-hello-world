import fastify from "fastify";

const app = fastify();

interface IQuerystring {
  username: string;
  password: string;
}

interface IHeaders {
  "h-Custom": string;
}

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

app.get<{
  Querystring: IQuerystring;
  Headers: IHeaders;
}>(
  "/auth",
  {
    preValidation: (request, reply, done) => {
      const { username, password } = request.query;
      done(username !== "admin" ? new Error("Must be admin") : undefined);
    },
  },
  async (request, reply) => {
    const customerHeader = request.headers["h-Custom"];
    return `logged in!`;
  }
);

const main = async () => {
  const PORT = 3000;

  try {
    await app.listen(PORT);
    console.log(`server listening on ${PORT}`);
  } catch (err) {
    app.log.error(err);
  }
};

main();
