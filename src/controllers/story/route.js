import { Router } from "express";
import { addStory, viewStory } from "./controller";

export const storyRouter = Router();

storyRouter.route("/").post(addStory);
storyRouter.route("/:id").get(viewStory);
