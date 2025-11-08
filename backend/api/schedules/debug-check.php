<?php
/**
 * Debug Script: Check Database State
 * Access this at: http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/debug-check.php
 */

require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

$results = [];

try {
    // Check grade levels
    $stmt = $db->query("SELECT COUNT(*) as count FROM gradelevel");
    $results['gradeLevels'] = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check subjects
    $stmt = $db->query("SELECT COUNT(*) as count FROM subject");
    $results['subjects'] = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check active school year
    $stmt = $db->query("SELECT * FROM schoolyear WHERE IsActive = 1");
    $results['activeSchoolYear'] = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check all school years
    $stmt = $db->query("SELECT SchoolYearID, YearName, IsActive FROM schoolyear");
    $results['allSchoolYears'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check sections
    $stmt = $db->query("SELECT COUNT(*) as count FROM section");
    $results['sections'] = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check section table structure
    $stmt = $db->query("DESCRIBE section");
    $results['sectionStructure'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $results
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
