import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  ESTOQUES_ID,
  MOVEMENTS_ID,
} from "@/config";

import { Estoque, Movement } from "../types";
import { createEstoqueSchema, updateEstoqueSchema, createMovementSchema } from "../schemas";

const app = new Hono()
  // Listar estoques
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const estoques = await databases.listDocuments<Estoque>(
        DATABASE_ID,
        ESTOQUES_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return c.json({ data: estoques });
    }
  )
  // Criar estoque
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createEstoqueSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { name, type, location, responsible, capacity, observations, workspaceId } =
        c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const estoque = await databases.createDocument(
        DATABASE_ID,
        ESTOQUES_ID,
        ID.unique(),
        {
          name,
          type,
          location,
          responsible,
          capacity,
          observations,
          workspaceId,
        }
      );

      return c.json({ data: estoque });
    }
  )
  // Atualizar estoque
  .patch(
    "/:estoqueId",
    sessionMiddleware,
    zValidator("json", updateEstoqueSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { estoqueId } = c.req.param();
      const { name, type, location, responsible, capacity, observations } =
        c.req.valid("json");

      const existingEstoque = await databases.getDocument<Estoque>(
        DATABASE_ID,
        ESTOQUES_ID,
        estoqueId
      );

      const member = await getMember({
        databases,
        workspaceId: existingEstoque.workspaceId,
        userId: user.$id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const estoque = await databases.updateDocument(
        DATABASE_ID,
        ESTOQUES_ID,
        estoqueId,
        {
          name,
          type,
          location,
          responsible,
          capacity,
          observations,
        }
      );

      return c.json({ data: estoque });
    }
  )
  // Deletar estoque
  .delete("/:estoqueId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { estoqueId } = c.req.param();

    const existingEstoque = await databases.getDocument<Estoque>(
      DATABASE_ID,
      ESTOQUES_ID,
      estoqueId
    );

    const member = await getMember({
      databases,
      workspaceId: existingEstoque.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    await databases.deleteDocument(DATABASE_ID, ESTOQUES_ID, estoqueId);

    return c.json({ data: { $id: estoqueId } });
  })
  // Buscar estoque específico
  .get("/:estoqueId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { estoqueId } = c.req.param();

    const estoque = await databases.getDocument<Estoque>(
      DATABASE_ID,
      ESTOQUES_ID,
      estoqueId
    );

    const member = await getMember({
      databases,
      workspaceId: estoque.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    return c.json({ data: estoque });
  })
  // Listar movimentações de um estoque
  .get(
    "/:estoqueId/movements",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { estoqueId } = c.req.param();

      const estoque = await databases.getDocument<Estoque>(
        DATABASE_ID,
        ESTOQUES_ID,
        estoqueId
      );

      const member = await getMember({
        databases,
        workspaceId: estoque.workspaceId,
        userId: user.$id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const movements = await databases.listDocuments<Movement>(
        DATABASE_ID,
        MOVEMENTS_ID,
        [
          Query.equal("estoqueId", estoqueId),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]
      );

      return c.json({ data: movements });
    }
  )
  // Criar movimentação
  .post(
    "/movements",
    sessionMiddleware,
    zValidator("json", createMovementSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const data = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId: data.workspaceId,
        userId: user.$id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const movement = await databases.createDocument(
        DATABASE_ID,
        MOVEMENTS_ID,
        ID.unique(),
        data
      );

      return c.json({ data: movement });
    }
  );

export default app;
