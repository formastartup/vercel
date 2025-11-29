import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  EPIS_ID,
} from "@/config";

import { Epi } from "../types";
import { createEpiSchema, updateEpiSchema } from "../schemas";

const app = new Hono()
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

      if (!member) return c.json({ error: "Não autorizado" }, 401);

      const epis = await databases.listDocuments<Epi>(
        DATABASE_ID,
        EPIS_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return c.json({ data: epis });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createEpiSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const {
        name,
        ca,
        category,
        protectionType,
        lifespan,
        lifespanUnit,
        unitOfMeasure,
        application,
        hasUvProtection,
        observations,
        image,
        workspaceId,
      } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) return c.json({ error: "Não autorizado" }, 401);

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const epi = await databases.createDocument(
        DATABASE_ID,
        EPIS_ID,
        ID.unique(),
        {
          name,
          ca,
          category,
          protectionType,
          lifespan,
          lifespanUnit,
          unitOfMeasure,
          application,
          hasUvProtection,
          observations,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );

      return c.json({ data: epi });
    }
  )
  .patch(
    "/:epiId",
    sessionMiddleware,
    zValidator("form", updateEpiSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { epiId } = c.req.param();
      const {
        name,
        ca,
        category,
        protectionType,
        lifespan,
        lifespanUnit,
        unitOfMeasure,
        application,
        hasUvProtection,
        observations,
        image,
      } = c.req.valid("form");

      const existingEpi = await databases.getDocument<Epi>(
        DATABASE_ID,
        EPIS_ID,
        epiId
      );

      const member = await getMember({
        databases,
        workspaceId: existingEpi.workspaceId,
        userId: user.$id,
      });

      if (!member) return c.json({ error: "Não autorizado" }, 401);

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }

      const epi = await databases.updateDocument(
        DATABASE_ID,
        EPIS_ID,
        epiId,
        {
          name,
          ca,
          category,
          protectionType,
          lifespan,
          lifespanUnit,
          unitOfMeasure,
          application,
          hasUvProtection,
          observations,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: epi });
    }
  )
  .delete("/:epiId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { epiId } = c.req.param();

    const existingEpi = await databases.getDocument<Epi>(
      DATABASE_ID,
      EPIS_ID,
      epiId
    );

    const member = await getMember({
      databases,
      workspaceId: existingEpi.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Não autorizado" }, 401);

    await databases.deleteDocument(DATABASE_ID, EPIS_ID, epiId);

    return c.json({ data: { $id: epiId } });
  })
  .get("/:epiId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { epiId } = c.req.param();

    const epi = await databases.getDocument<Epi>(DATABASE_ID, EPIS_ID, epiId);

    const member = await getMember({
      databases,
      workspaceId: epi.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Não autorizado" }, 401);

    return c.json({ data: epi });
  });

export default app;
