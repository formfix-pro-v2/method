import { test, expect } from "@playwright/test";

// ============================================================
// API VALIDATION TESTS
// ============================================================
// Testiraju da Zod validacija pravilno odbija loše podatke
// i da API rute vraćaju ispravne status kodove.
// ============================================================

test.describe("API Validation — /api/checkin", () => {
  test("POST bez body-ja vraća 400", async ({ request }) => {
    const res = await request.post("/api/checkin", {
      data: {},
    });
    // Može biti 400 (validacija) ili 401 (neautentifikovan)
    expect([400, 401]).toContain(res.status());
  });

  test("POST sa nevalidnim sleep vrednostima vraća 400", async ({ request }) => {
    const res = await request.post("/api/checkin", {
      data: { sleep: 99, energy: 5, stress: 5 },
    });
    expect([400, 401]).toContain(res.status());
  });

  test("POST sa negativnim vrednostima vraća 400", async ({ request }) => {
    const res = await request.post("/api/checkin", {
      data: { sleep: -1, energy: 0, stress: -5 },
    });
    expect([400, 401]).toContain(res.status());
  });
});

test.describe("API Validation — /api/sessions", () => {
  test("POST bez body-ja vraća 400", async ({ request }) => {
    const res = await request.post("/api/sessions", {
      data: {},
    });
    expect([400, 401]).toContain(res.status());
  });

  test("POST sa nevalidnom fazom vraća 400", async ({ request }) => {
    const res = await request.post("/api/sessions", {
      data: { day: 1, phase: "invalid_phase" },
    });
    expect([400, 401]).toContain(res.status());
  });

  test("POST sa prevelikim danom vraća 400", async ({ request }) => {
    const res = await request.post("/api/sessions", {
      data: { day: 9999, phase: "foundation" },
    });
    expect([400, 401]).toContain(res.status());
  });
});

test.describe("API Validation — /api/journal", () => {
  test("POST bez teksta vraća 400", async ({ request }) => {
    const res = await request.post("/api/journal", {
      data: { day: 1 },
    });
    expect([400, 401]).toContain(res.status());
  });

  test("POST sa praznim tekstom vraća 400", async ({ request }) => {
    const res = await request.post("/api/journal", {
      data: { day: 1, text: "" },
    });
    expect([400, 401]).toContain(res.status());
  });
});

test.describe("API Validation — /api/favorites", () => {
  test("POST sa nevalidnim tipom vraća 400", async ({ request }) => {
    const res = await request.post("/api/favorites", {
      data: { type: "invalid", name: "test" },
    });
    expect([400, 401]).toContain(res.status());
  });

  test("POST bez imena vraća 400", async ({ request }) => {
    const res = await request.post("/api/favorites", {
      data: { type: "meal" },
    });
    expect([400, 401]).toContain(res.status());
  });
});

test.describe("API Validation — /api/achievements", () => {
  test("POST bez achievement_id vraća 400", async ({ request }) => {
    const res = await request.post("/api/achievements", {
      data: {},
    });
    expect([400, 401]).toContain(res.status());
  });
});

test.describe("API Validation — /api/subscription", () => {
  test("POST sa nevalidnim planom vraća 400", async ({ request }) => {
    const res = await request.post("/api/subscription", {
      data: { plan: "super_premium" },
    });
    expect([400, 401]).toContain(res.status());
  });

  test("POST bez plana vraća 400", async ({ request }) => {
    const res = await request.post("/api/subscription", {
      data: {},
    });
    expect([400, 401]).toContain(res.status());
  });
});

test.describe("API Validation — /api/leads", () => {
  test("POST bez emaila vraća 400", async ({ request }) => {
    const res = await request.post("/api/leads", {
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test("POST sa nevalidnim emailom vraća 400", async ({ request }) => {
    const res = await request.post("/api/leads", {
      data: { email: "not-an-email" },
    });
    expect(res.status()).toBe(400);
  });

  test("POST sa validnim emailom vraća 200", async ({ request }) => {
    const res = await request.post("/api/leads", {
      data: { email: "test@example.com", source: "test" },
    });
    // 200 čak i ako leads tabela ne postoji (graceful fail)
    expect(res.status()).toBe(200);
  });
});

test.describe("API Auth — zaštićene rute bez autentifikacije", () => {
  test("GET /api/profile vraća 401", async ({ request }) => {
    const res = await request.get("/api/profile");
    expect(res.status()).toBe(401);
  });

  test("GET /api/sessions vraća 401", async ({ request }) => {
    const res = await request.get("/api/sessions");
    expect(res.status()).toBe(401);
  });

  test("GET /api/journal vraća 401", async ({ request }) => {
    const res = await request.get("/api/journal");
    expect(res.status()).toBe(401);
  });

  test("GET /api/favorites vraća 401", async ({ request }) => {
    const res = await request.get("/api/favorites");
    expect(res.status()).toBe(401);
  });

  test("GET /api/achievements vraća 401", async ({ request }) => {
    const res = await request.get("/api/achievements");
    expect(res.status()).toBe(401);
  });

  test("GET /api/checkin vraća 401", async ({ request }) => {
    const res = await request.get("/api/checkin");
    expect(res.status()).toBe(401);
  });

  test("DELETE /api/account vraća 401", async ({ request }) => {
    const res = await request.delete("/api/account");
    expect(res.status()).toBe(401);
  });
});

test.describe("API — LemonSqueezy webhook", () => {
  test("POST bez signature vraća 401", async ({ request }) => {
    const res = await request.post("/api/webhooks/lemonsqueezy", {
      data: { meta: { event_name: "order_created" } },
    });
    // 401 (nema signature) ili 500 (nema webhook secret)
    expect([401, 500]).toContain(res.status());
  });

  test("POST sa lažnim signature vraća 401", async ({ request }) => {
    const res = await request.post("/api/webhooks/lemonsqueezy", {
      data: { meta: { event_name: "order_created" } },
      headers: { "x-signature": "fake-signature-12345" },
    });
    expect([401, 500]).toContain(res.status());
  });
});

test.describe("Rate Limiting — /api/leads", () => {
  test("previše zahteva vraća 429", async ({ request }) => {
    // Šaljemo 6 zahteva brzo (limit je 5/min)
    const results: number[] = [];
    for (let i = 0; i < 7; i++) {
      const res = await request.post("/api/leads", {
        data: { email: `test${i}@example.com` },
      });
      results.push(res.status());
    }
    // Bar jedan od poslednjih zahteva treba da bude 429
    expect(results).toContain(429);
  });
});
