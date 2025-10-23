<?php
$command = $argv[1] ?? null;
$name = $argv[2] ?? null;

$baseDir = __DIR__;
$migrationsDir = $baseDir . '/migrations';
$seedersDir = $baseDir . '/seeders';

// helper to ensure directory exists
function ensure_dir($dir) {
    if (!is_dir($dir)) {
        if (!mkdir($dir, 0777, true) && !is_dir($dir)) {
            echo "Failed to create directory: $dir\n";
            exit(1);
        }
    }
}

switch($command){
    case 'make:migration';
    if(!$name){
        echo "Please provide a migration name.\n";
        exit(1);
    }
    ensure_dir($migrationsDir);
    $timestamp = date('Y_m_d_His');
    $filename = "{$migrationsDir}/{$timestamp}_{$name}.php";
    $template = "<?php\n\nrequire_once __DIR__ . '/../config/db.php';\n\nfunction migrate_{$name}(\$conn) {\n    // TODO: Add migration SQL here\n}\n\nmigrate_{$name}(\$conn);\n";
    file_put_contents($filename, $template);
    echo "✅ Migration created: {$filename}\n";
    break;

    case 'make:seeder';
    if(!$name){
        echo "Please provide a seeder name.\n";
        exit(1);
    }
    ensure_dir($seedersDir);
    $filename = "{$seedersDir}/{$name}.php";
    $template = "<?php\n\nrequire_once __DIR__ . '/../config/db.php';\n\nfunction seed_{$name}(\$conn) {\n    // TODO: Insert seeding logic here\n}\n\nseed_{$name}(\$conn);\n";
    file_put_contents($filename, $template);
    echo "✅ Seeder created: {$filename}\n";
    break;

    case 'migrate':
        foreach (glob("{$migrationsDir}/*.php") as $file) {
            echo "Running migration: $file\n";
            require_once $file;
        }
        echo "✅ All migrations executed.\n";
        break;

    case 'db:seed':
        foreach (glob("{$seedersDir}/*.php") as $file) {
            echo "Running seeder: $file\n";
            require_once $file;
        }
        echo "✅ All seeders executed.\n";
        break;

    default:
        echo "Available commands:\n";
        echo "  php backend/cli.php make:migration <name>\n";
        echo "  php backend/cli.php make:seeder <name>\n";
        echo "  php backend/cli.php migrate\n";
        echo "  php backend/cli.php db:seed\n";
        break;
}