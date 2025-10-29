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
include_once '../models/SchoolYear.php';

// Initialization
$database = new Database();
$db = $database->getConnection();
if ($db === null) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}
$schoolYear = new SchoolYear($db);

// Request Method
$requestMethod = $_SERVER["REQUEST_METHOD"];

try {
    switch ($requestMethod) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Get one
                $id = (int)$_GET['id'];
                if ($schoolYear->readOne($id)) {
                    http_response_code(200);
                    echo json_encode(array(
                        "SchoolYearID" => $schoolYear->SchoolYearID,
                        "YearName" => $schoolYear->YearName,
                        "StartDate" => $schoolYear->StartDate,
                        "EndDate" => $schoolYear->EndDate,
                        "IsActive" => $schoolYear->IsActive
                    ));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "School year not found."));
                }
            } else {
                // Get all
                $stmt = $schoolYear->read();
                $num = $stmt->rowCount();
                if ($num > 0) {
                    $schoolYears_arr = array();
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        extract($row);
                        array_push($schoolYears_arr, $row); // $row is already an assoc array
                    }
                    http_response_code(200);
                    echo json_encode($schoolYears_arr);
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "No school years found."));
                }
            }
            break;

        case 'POST':
            // Create
            $data = json_decode(file_get_contents("php://input"));
            if (!empty($data->YearName) && !empty($data->StartDate) && !empty($data->EndDate)) {
                if ($schoolYear->create($data)) {
                    http_response_code(201);
                    echo json_encode(array("message" => "School year was created."));
                } else {
                    http_response_code(500);
                    echo json_encode(array("message" => "Unable to create school year."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Incomplete data. YearName, StartDate, and EndDate are required."));
            }
            break;

        case 'PUT':
            // Update
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $data = json_decode(file_get_contents("php://input"));
            if ($id > 0 && !empty($data->YearName) && !empty($data->StartDate) && !empty($data->EndDate)) {
                if ($schoolYear->update($id, $data)) {
                    http_response_code(200);
                    echo json_encode(array("message" => "School year was updated."));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Unable to update school year. Record not found or no changes."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Incomplete data. ID, YearName, StartDate, and EndDate are required."));
            }
            break;

        case 'DELETE':
            // Delete
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id > 0) {
                if ($schoolYear->delete($id)) {
                    http_response_code(200);
                    echo json_encode(array("message" => "School year was deleted."));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Unable to delete school year. Record not found or in use."));
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