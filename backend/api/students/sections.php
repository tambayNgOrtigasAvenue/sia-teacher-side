<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Includes
include_once '../config/database.php';
include_once '../models/Section.php';

// Initialization
$database = new Database();
$db = $database->getConnection();
if ($db === null) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}
$section = new Section($db);

// Request Method
$requestMethod = $_SERVER["REQUEST_METHOD"];

try {
    switch ($requestMethod) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Get one (with JOINed data)
                $id = (int)$_GET['id'];
                if ($section->readOne($id)) {
                    http_response_code(200);
                    // Return all properties, including base IDs and joined names
                    echo json_encode(array(
                        "SectionID" => $section->SectionID,
                        "SectionName" => $section->SectionName,
                        "MaxCapacity" => $section->MaxCapacity,
                        "CurrentEnrollment" => $section->CurrentEnrollment,
                        "GradeLevelID" => $section->GradeLevelID,
                        "LevelName" => $section->LevelName,
                        "SchoolYearID" => $section->SchoolYearID,
                        "YearName" => $section->YearName,
                        "AdviserTeacherID" => $section->AdviserTeacherID,
                        "AdviserEmployeeNumber" => $section->AdviserEmployeeNumber
                    ));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Section not found."));
                }
            } else {
                // Get all (with JOINed data)
                $stmt = $section->read();
                $num = $stmt->rowCount();
                if ($num > 0) {
                    $sections_arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    http_response_code(200);
                    echo json_encode($sections_arr);
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "No sections found."));
                }
            }
            break;

        case 'POST':
            // Create
            $data = json_decode(file_get_contents("php://input"));
            if (!empty($data->SectionName) && !empty($data->GradeLevelID) && !empty($data->SchoolYearID)) {
                if ($section->create($data)) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Section was created."));
                } else {
                    http_response_code(500);
                    echo json_encode(array("message" => "Unable to create section. Check foreign keys."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Incomplete data. SectionName, GradeLevelID, and SchoolYearID are required."));
            }
            break;

        case 'PUT':
            // Update
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $data = json_decode(file_get_contents("php://input"));
            if ($id > 0 && !empty($data->SectionName) && !empty($data->GradeLevelID) && !empty($data->SchoolYearID)) {
                if ($section->update($id, $data)) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Section was updated."));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Unable to update section. Record not found or no changes."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Incomplete data. ID, SectionName, GradeLevelID, and SchoolYearID are required."));
            }
            break;

        case 'DELETE':
            // Delete
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id > 0) {
                if ($section->delete($id)) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Section was deleted."));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Unable to delete section. Record not found or in use by students."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "No ID provided."));
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(array("message" => "Method not allowed."));
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "An unexpected error occurred.",
        "error" => $e->getMessage()
    ));
}
?>