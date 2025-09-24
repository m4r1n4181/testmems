using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicEventManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class TicketSalesSubsystemEntityRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SegmentId",
                table: "Zones",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "TicketTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ZoneId",
                table: "TicketTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RecordedSaleId",
                table: "Tickets",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TicketTypeId",
                table: "Tickets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VenueId",
                table: "Segments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "RecordedSales",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "EventPricingRules",
                columns: table => new
                {
                    EventsId = table.Column<int>(type: "integer", nullable: false),
                    PricingRulesPricingRuleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventPricingRules", x => new { x.EventsId, x.PricingRulesPricingRuleId });
                    table.ForeignKey(
                        name: "FK_EventPricingRules_Events_EventsId",
                        column: x => x.EventsId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventPricingRules_PricingRules_PricingRulesPricingRuleId",
                        column: x => x.PricingRulesPricingRuleId,
                        principalTable: "PricingRules",
                        principalColumn: "PricingRuleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecordedSaleSpecialOffers",
                columns: table => new
                {
                    RecordedSalesRecordedSaleId = table.Column<int>(type: "integer", nullable: false),
                    SpecialOffersSpecialOfferId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecordedSaleSpecialOffers", x => new { x.RecordedSalesRecordedSaleId, x.SpecialOffersSpecialOfferId });
                    table.ForeignKey(
                        name: "FK_RecordedSaleSpecialOffers_RecordedSales_RecordedSalesRecord~",
                        column: x => x.RecordedSalesRecordedSaleId,
                        principalTable: "RecordedSales",
                        principalColumn: "RecordedSaleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecordedSaleSpecialOffers_SpecialOffers_SpecialOffersSpecia~",
                        column: x => x.SpecialOffersSpecialOfferId,
                        principalTable: "SpecialOffers",
                        principalColumn: "SpecialOfferId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TicketTypePricingRules",
                columns: table => new
                {
                    PricingRulesPricingRuleId = table.Column<int>(type: "integer", nullable: false),
                    TicketTypesTicketTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketTypePricingRules", x => new { x.PricingRulesPricingRuleId, x.TicketTypesTicketTypeId });
                    table.ForeignKey(
                        name: "FK_TicketTypePricingRules_PricingRules_PricingRulesPricingRule~",
                        column: x => x.PricingRulesPricingRuleId,
                        principalTable: "PricingRules",
                        principalColumn: "PricingRuleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketTypePricingRules_TicketTypes_TicketTypesTicketTypeId",
                        column: x => x.TicketTypesTicketTypeId,
                        principalTable: "TicketTypes",
                        principalColumn: "TicketTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TicketTypeSpecialOffers",
                columns: table => new
                {
                    SpecialOffersSpecialOfferId = table.Column<int>(type: "integer", nullable: false),
                    TicketTypesTicketTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketTypeSpecialOffers", x => new { x.SpecialOffersSpecialOfferId, x.TicketTypesTicketTypeId });
                    table.ForeignKey(
                        name: "FK_TicketTypeSpecialOffers_SpecialOffers_SpecialOffersSpecialO~",
                        column: x => x.SpecialOffersSpecialOfferId,
                        principalTable: "SpecialOffers",
                        principalColumn: "SpecialOfferId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketTypeSpecialOffers_TicketTypes_TicketTypesTicketTypeId",
                        column: x => x.TicketTypesTicketTypeId,
                        principalTable: "TicketTypes",
                        principalColumn: "TicketTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Zones_SegmentId",
                table: "Zones",
                column: "SegmentId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypes_EventId",
                table: "TicketTypes",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypes_ZoneId",
                table: "TicketTypes",
                column: "ZoneId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_RecordedSaleId",
                table: "Tickets",
                column: "RecordedSaleId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_TicketTypeId",
                table: "Tickets",
                column: "TicketTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Segments_VenueId",
                table: "Segments",
                column: "VenueId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordedSales_ApplicationUserId",
                table: "RecordedSales",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_EventPricingRules_PricingRulesPricingRuleId",
                table: "EventPricingRules",
                column: "PricingRulesPricingRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordedSaleSpecialOffers_SpecialOffersSpecialOfferId",
                table: "RecordedSaleSpecialOffers",
                column: "SpecialOffersSpecialOfferId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypePricingRules_TicketTypesTicketTypeId",
                table: "TicketTypePricingRules",
                column: "TicketTypesTicketTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypeSpecialOffers_TicketTypesTicketTypeId",
                table: "TicketTypeSpecialOffers",
                column: "TicketTypesTicketTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecordedSales_AspNetUsers_ApplicationUserId",
                table: "RecordedSales",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Segments_Venues_VenueId",
                table: "Segments",
                column: "VenueId",
                principalTable: "Venues",
                principalColumn: "VenueId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_RecordedSales_RecordedSaleId",
                table: "Tickets",
                column: "RecordedSaleId",
                principalTable: "RecordedSales",
                principalColumn: "RecordedSaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_TicketTypes_TicketTypeId",
                table: "Tickets",
                column: "TicketTypeId",
                principalTable: "TicketTypes",
                principalColumn: "TicketTypeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketTypes_Events_EventId",
                table: "TicketTypes",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketTypes_Zones_ZoneId",
                table: "TicketTypes",
                column: "ZoneId",
                principalTable: "Zones",
                principalColumn: "ZoneId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Zones_Segments_SegmentId",
                table: "Zones",
                column: "SegmentId",
                principalTable: "Segments",
                principalColumn: "SegmentId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecordedSales_AspNetUsers_ApplicationUserId",
                table: "RecordedSales");

            migrationBuilder.DropForeignKey(
                name: "FK_Segments_Venues_VenueId",
                table: "Segments");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_RecordedSales_RecordedSaleId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_TicketTypes_TicketTypeId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketTypes_Events_EventId",
                table: "TicketTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketTypes_Zones_ZoneId",
                table: "TicketTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_Zones_Segments_SegmentId",
                table: "Zones");

            migrationBuilder.DropTable(
                name: "EventPricingRules");

            migrationBuilder.DropTable(
                name: "RecordedSaleSpecialOffers");

            migrationBuilder.DropTable(
                name: "TicketTypePricingRules");

            migrationBuilder.DropTable(
                name: "TicketTypeSpecialOffers");

            migrationBuilder.DropIndex(
                name: "IX_Zones_SegmentId",
                table: "Zones");

            migrationBuilder.DropIndex(
                name: "IX_TicketTypes_EventId",
                table: "TicketTypes");

            migrationBuilder.DropIndex(
                name: "IX_TicketTypes_ZoneId",
                table: "TicketTypes");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_RecordedSaleId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_TicketTypeId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Segments_VenueId",
                table: "Segments");

            migrationBuilder.DropIndex(
                name: "IX_RecordedSales_ApplicationUserId",
                table: "RecordedSales");

            migrationBuilder.DropColumn(
                name: "SegmentId",
                table: "Zones");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "TicketTypes");

            migrationBuilder.DropColumn(
                name: "ZoneId",
                table: "TicketTypes");

            migrationBuilder.DropColumn(
                name: "RecordedSaleId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "TicketTypeId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "VenueId",
                table: "Segments");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "RecordedSales");
        }
    }
}
