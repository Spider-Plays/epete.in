import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { Router } from "express";
import path from "path";

// Load Swagger document
const swaggerDocument = YAML.load(
  path.join(__dirname, "../../docs/swagger.yaml")
) as Record<string, unknown>;

// Create router for docs
const router = Router();

// Serve Swagger UI
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));

export default router;
