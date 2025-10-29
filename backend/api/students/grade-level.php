<?php
// --- Set HTTP Headers ---
// Allow requests from any origin (replace '*' with your React app's domain for production)
header("Access-Control-Allow-Origin: *");
// Set the content type to JSON
header("Content-Type: application/json; charset=UTF-8");
// Specify allowed HTTP methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// Set max age for preflight cache
header("Access-Control-Max-Age: 3600");
// Specify allowed headers
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// --- Handle Preflight OPTIONS Request ---
// The OPTIONS method is used by browsers to check CORS settings
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Include Database and Model ---
include_once '../config/database.php';
include_once '../models/GradeLevel.php';

// --- Initialize Database and Model ---
$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    // Database connection failed
    http_response_code(500); // Internal Server Error
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$gradeLevel = new GradeLevel($db);

// --- Handle Request Method ---
$requestMethod = $_SERVER["REQUEST_METHOD"];

try {
    switch ($requestMethod) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Get one grade level
                $id = (int)$_GET['id'];
                if ($gradeLevel->readOne($id)) {
                    // Found
                    http_response_code(200);
                    echo json_encode(array(
                        "GradeLevelID" => $gradeLevel->GradeLevelID,
                        "LevelName" => $gradeLevel->LevelName,
                        "SortOrder" => $gradeLevel->SortOrder
                    ));
                } else {
                    // Not Found
                    http_response_code(404);
                    echo json_encode(array("message" => "Grade level not found."));
                }
            } else {
                // Get all grade levels
                $stmt = $gradeLevel->read();
                $num = $stmt->rowCount();

                if ($num > 0) {
                    $gradeLevels_arr = array();
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        extract($row);
                        $gradeLevel_item = array(
                            "GradeLevelID" => $GradeLevelID,
                            "LevelName" => $LevelName,
                            "SortOrder" => $SortOrder
                        );
                        array_push($gradeLevels_arr, $gradeLevel_item);
                    }
                    http_response_code(200);
                    echo json_encode($gradeLevels_arr);
                } else {
                    // No records found
                    http_response_code(404);
                    echo json_encode(array("message" => "No grade levels found."));
                }
            }
            break;

        case 'POST':
            // Create a new grade level
            $data = json_decode(file_get_contents("php://input"));

            if (empty($data->LevelName) || !isset($data->SortOrder)) {
                // Bad Request
                http_response_code(400);
                echo json_encode(array("message" => "Incomplete data. LevelName and SortOrder are required."));
            } else {
                if ($gradeLevel->create($data)) {
                    // Created
                    http_response_code(201);
                    echo json_encode(array("message" => "Grade level was created."));
                } else {
                    // Internal Server Error
                    http_response_code(500);
                    echo json_encode(array("message" => "Unable to create grade level."));
                }
            }
            break;

        case 'PUT':
            // Update a grade level
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $data = json_decode(file_get_contents("php://input"));

            if ($id > 0 && !empty($data->LevelName) && isset($data->SortOrder)) {
                if ($gradeLevel->update($id, $data)) {
                    // OK
                    http_response_code(200);
                    echo json_encode(array("message" => "Grade level was updated."));
                } else {
                    // Not Found or Internal Server Error
                    // We can't be sure which it is without checking if the ID exists first
                    http_response_code(404); // Or 500
                    echo json_encode(array("message" => "Unable to update grade level. Record not found or no changes made."));
                }
            } else {
                // Bad Request
                http_response_code(400);
                echo json_encode(array("message" => "Incomplete data. ID, LevelName, and SortOrder are required."));
            }
            break;

        case 'DELETE':
            // Delete a grade level
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

            if ($id > 0) {
                if ($gradeLevel->delete($id)) {
                    // OK
                    http_response_code(200);
                    echo json_encode(array("message" => "Grade level was deleted."));
                } else {
                    // Not Found or Internal Server Error (e.g., FK constraint)
                    http_response_code(404); // Or 500
                    echo json_encode(array("message" => "Unable to delete grade level. Record not found or it's in use."));
                }
            } else {
                // Bad Request
                http_response_code(400);
                echo json_encode(array("message" => "No ID provided."));
            }
            break;

        default:
            // Method Not Allowed
            http_response_code(405);
            echo json_encode(array("message" => "Method not allowed."));
            break;
    }
} catch (Exception $e) {
    // Catch any unexpected errors
    http_response_code(500);
    echo json_encode(array(
        "message" => "An unexpected error occurred.",
        "error" => $e->getMessage()
    ));
}
?>