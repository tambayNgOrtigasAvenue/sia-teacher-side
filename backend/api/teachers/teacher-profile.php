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
include_once '../models/TeacherProfile.php';

// Initialization
$database = new Database();
$db = $database->getConnection();
if ($db === null) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}
$teacherProfile = new TeacherProfile($db);

// Request Method
$requestMethod = $_SERVER["REQUEST_METHOD"];

try {
    switch ($requestMethod) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Get one
                $id = (int)$_GET['id'];
                if ($teacherProfile->readOne($id)) {
                    http_response_code(200);
                    echo json_encode(array(
                        "TeacherProfileID" => $teacherProfile->TeacherProfileID,
                        "ProfileID" => $teacherProfile->ProfileID,
                        "EmployeeNumber" => $teacherProfile->EmployeeNumber,
                        "Specialization" => $teacherProfile->Specialization,
                        "HireDate" => $teacherProfile->HireDate
                    ));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Teacher profile not found."));
                }
            } else {
                // Get all
                $stmt = $teacherProfile->read();
                $num = $stmt->rowCount();
                if ($num > 0) {
                    $profiles_arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    http_response_code(200);
                    echo json_encode($profiles_arr);
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "No teacher profiles found."));
                }
            }
            break;

        case 'POST':
            // Create
            $data = json_decode(file_get_contents("php://input"));
            if (!empty($data->ProfileID) && !empty($data->EmployeeNumber)) {
                if ($teacherProfile->create($data)) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Teacher profile was created."));
                } else {
                    http_response_code(500);
                    echo json_encode(array("message" => "Unable to create teacher profile. Check for duplicate EmployeeNumber."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Incomplete data. ProfileID and EmployeeNumber are required."));
            }
            break;

        case 'PUT':
            // Update
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $data = json_decode(file_get_contents("php://input"));
            if ($id > 0 && !empty($data->ProfileID) && !empty($data->EmployeeNumber)) {
                if ($teacherProfile->update($id, $data)) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Teacher profile was updated."));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Unable to update teacher profile. Record not found or no changes."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Incomplete data. ID, ProfileID, and EmployeeNumber are required."));
            }
            break;

        case 'DELETE':
            // Delete
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id > 0) {
                if ($teacherProfile->delete($id)) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Teacher profile was deleted."));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Unable to delete teacher profile. Record not found or in use as an adviser."));
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