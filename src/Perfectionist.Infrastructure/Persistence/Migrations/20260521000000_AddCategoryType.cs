using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Perfectionist.Infrastructure.Persistence.Migrations;

public partial class AddCategoryType : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_Categories_UserId_Name",
            table: "Categories");

        migrationBuilder.AddColumn<int>(
            name: "Type",
            table: "Categories",
            type: "integer",
            nullable: false,
            defaultValue: 2);

        migrationBuilder.CreateIndex(
            name: "IX_Categories_UserId_Type_Name",
            table: "Categories",
            columns: new[] { "UserId", "Type", "Name" },
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_Categories_UserId_Type_Name",
            table: "Categories");

        migrationBuilder.DropColumn(
            name: "Type",
            table: "Categories");

        migrationBuilder.CreateIndex(
            name: "IX_Categories_UserId_Name",
            table: "Categories",
            columns: new[] { "UserId", "Name" },
            unique: true);
    }
}
