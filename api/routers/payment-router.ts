import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createRouter, publicQuery, adminQuery, parentQuery } from "../middleware";
import {
  findParentById,
  findParentByMobile,
  listParents,
  createParent,
  updateParent,
  getParentCount,
} from "../queries/parents";
import { createCustomSession, getCustomCookieName } from "../custom-auth";
import * as cookie from "cookie";