<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config/db.php';

$database = new Database();
$db = $database->getConnection();

$teachers = [
    [
        'FirstName' => 'Maria',
        'LastName' => 'Santos',
        'Email' => 'maria.santos@gca.edu.ph',
        'EmployeeNumber' => 'T-2025-001',
        'UserType' => 'Head Teacher',
        'Specialization' => 'Mathematics'
    ],
    [
        'FirstName' => 'Jose',
        'LastName' => 'Reyes',
        'Email' => 'jose.reyes@gca.edu.ph',
        'EmployeeNumber' => 'T-2025-002',
        'UserType' => 'Teacher',
        'Specialization' => 'Science'
    ],
    [
        'FirstName' => 'Ana',
        'LastName' => 'Dela Cruz',
        'Email' => 'ana.delacruz@gca.edu.ph',
        'EmployeeNumber' => 'T-2025-003',
        'UserType' => 'Teacher',
        'Specialization' => 'English'
    ],
    [
        'FirstName' => 'Pedro',
        'LastName' => 'Garcia',
        'Email' => 'pedro.garcia@gca.edu.ph',
        'EmployeeNumber' => 'T-2025-004',
        'UserType' => 'Teacher',
        'Specialization' => 'History'
    ],
    [
        'FirstName' => 'Clara',
        'LastName' => 'Bautista',
        'Email' => 'clara.bautista@gca.edu.ph',
        'EmployeeNumber' => 'T-2025-005',
        'UserType' => 'Teacher',
        'Specialization' => 'Filipino'
    ]
];

$password = '12345';
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

echo "Seeding teachers...\n";

foreach ($teachers as $teacher) {
    try {
        $db->beginTransaction();

        // 1. Insert into user
        $stmt = $db->prepare("INSERT INTO user (EmailAddress, UserType, AccountStatus) VALUES (?, ?, 'Active')");
        $stmt->execute([$teacher['Email'], $teacher['UserType']]);
        $userId = $db->lastInsertId();

        // 2. Insert into profile
        $stmt = $db->prepare("INSERT INTO profile (UserID, FirstName, LastName) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $teacher['FirstName'], $teacher['LastName']]);
        $profileId = $db->lastInsertId();

        // 3. Insert into teacherprofile
        $stmt = $db->prepare("INSERT INTO teacherprofile (ProfileID, EmployeeNumber, Specialization, HireDate) VALUES (?, ?, ?, CURDATE())");
        $stmt->execute([$profileId, $teacher['EmployeeNumber'], $teacher['Specialization']]);

        // 4. Insert into passwordpolicy
        $stmt = $db->prepare("INSERT INTO passwordpolicy (UserID, PasswordHash, PasswordSetDate) VALUES (?, ?, NOW())");
        $stmt->execute([$userId, $passwordHash]);
        
        // 5. Insert into userrole (Assuming RoleID 4 is Teacher based on previous context, but let's check or skip if not strictly needed. 
        // The user table has UserType. But let's try to be thorough if we can find the RoleID.
        // Based on diffs: (4, 'Teacher', 'Grades', 1)
        $stmt = $db->prepare("INSERT INTO userrole (UserID, RoleID, AssignedDate) VALUES (?, 4, CURDATE())");
        $stmt->execute([$userId]);

        $db->commit();
        echo "Created teacher: " . $teacher['FirstName'] . " " . $teacher['LastName'] . " (" . $teacher['Email'] . ")\n";

    } catch (Exception $e) {
        $db->rollBack();
        echo "Failed to create teacher " . $teacher['Email'] . ": " . $e->getMessage() . "\n";
    }
}

echo "Done.\n";
?>
