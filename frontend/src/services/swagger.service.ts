import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { Router } from "express";

// Load Swagger document
const swaggerDocument = YAML.load("./src/docs/swagger.yaml");

// Create router for docs
const router = Router();

// Serve Swagger UI
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));

export default router;
