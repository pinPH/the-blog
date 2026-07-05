import { delay, http, HttpResponse } from "msw";

type LoginBody = {
  username?: string;
  email?: string;
  password?: string;
};

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    await delay(1200);

    const body = (await request.json().catch(() => null)) as LoginBody | null;

    if ((!body?.username && !body?.email) || !body?.password) {
      return HttpResponse.json(
        { message: "Username/email and password are required." },
        { status: 400 },
      );
    }

    if (body.password !== "coxinha123") {
      return HttpResponse.json(
        { message: "Invalid credentials." },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      token: "mock-jwt-token",
      user: {
        id: 1,
        name: body.username || "Demo User",
        email: body.email || "demo@theblog.com",
      },
    });
  }),
];
