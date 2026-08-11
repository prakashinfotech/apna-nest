namespace ApnaNest.Data.Entities;

/// <summary>
/// Enriched property response sourced from vw_properties (JOINs with cities, localities, users, images, amenities).
/// Images and amenities come as CSV strings and are split into arrays at read time.
/// </summary>
public class PropertyDto
{
    // ── Core IDs ────────────────────────────────────────────
    public Guid   Id         { get; set; }
    public Guid   OwnerId    { get; set; }
    public Guid   CityId     { get; set; }
    public Guid   LocalityId { get; set; }

    // ── Location ────────────────────────────────────────────
    public string?  AddressLine { get; set; }
    public decimal? Latitude    { get; set; }
    public decimal? Longitude   { get; set; }
    public string?  PinCode     { get; set; }

    // ── Classification ──────────────────────────────────────
    public short PropertyTypeId  { get; set; }
    public short ListingIntentId { get; set; }

    // ── Specs ───────────────────────────────────────────────
    public string  Title       { get; set; } = string.Empty;
    public string? Description { get; set; }
    public short?  Bhk         { get; set; }
    public short?  Bathrooms   { get; set; }
    public decimal AreaSqft    { get; set; }
    public short?  FloorNumber { get; set; }
    public short?  TotalFloors { get; set; }
    public short?  AgeYears    { get; set; }

    // ── Pricing ─────────────────────────────────────────────
    public decimal  Price               { get; set; }
    public bool     IsPriceNegotiable   { get; set; }
    public decimal? MaintenancePerMonth { get; set; }

    // ── Condition ───────────────────────────────────────────
    public short?    FurnishingStatusId { get; set; }
    public short?    PossessionStatusId { get; set; }
    public DateOnly? AvailableFrom      { get; set; }

    // ── Flags ───────────────────────────────────────────────
    public bool   IsReraVerified  { get; set; }
    public string? ReraNumber     { get; set; }
    public bool   IsZeroBrokerage { get; set; }
    public bool   IsFeatured      { get; set; }
    public bool   IsActive        { get; set; }
    public int    ViewCount       { get; set; }
    public int    LeadCount       { get; set; }

    // ── Timestamps ──────────────────────────────────────────
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // ── Enriched (from JOINs) ───────────────────────────────
    public string  CityName     { get; set; } = string.Empty;
    public string  CitySlug     { get; set; } = string.Empty;
    public string  LocalityName { get; set; } = string.Empty;
    public string  LocalitySlug { get; set; } = string.Empty;
    public string? OwnerName    { get; set; }
    public string? OwnerPhone   { get; set; }
    public string? OwnerEmail   { get; set; }

    // ── Computed array properties for the frontend ──────────
    public string[] Images    { get; private set; } = [];
    public string[] Amenities { get; private set; } = [];

    // Since these are set from the CSV strings, we need a method to populate them or set them in the constructor/mapping
    // Alternatively, we can use [JsonInclude] if System.Text.Json is used.
    // However, the cleanest way in this architecture is to set them after Dapper mapping or use a private set and logic in the CSV setters.

    private string _imagesCsv = string.Empty;
    public string ImagesCsv 
    { 
        get => _imagesCsv; 
        set { _imagesCsv = value; Images = string.IsNullOrEmpty(value) ? [] : value.Split(',', StringSplitOptions.RemoveEmptyEntries); } 
    }

    private string _amenitiesCsv = string.Empty;
    public string AmenitiesCsv 
    { 
        get => _amenitiesCsv; 
        set { _amenitiesCsv = value; Amenities = string.IsNullOrEmpty(value) ? [] : value.Split(',', StringSplitOptions.RemoveEmptyEntries); } 
    }

    // ── Computed display helpers ─────────────────────────────
    public string PropertyTypeName => PropertyTypeId switch {
        1 => "Apartment", 2 => "Villa", 3 => "Plot", 4 => "PG",
        5 => "Commercial", 6 => "Studio", 7 => "Builder Floor", _ => "Property"
    };

    public string ListingIntentName => ListingIntentId switch {
        1 => "Buy", 2 => "Rent", 3 => "PG", _ => "Rent"
    };

    public string FurnishingLabel => FurnishingStatusId switch {
        1 => "Unfurnished", 2 => "Semi Furnished", 3 => "Fully Furnished", _ => "Unfurnished"
    };

    public string PossessionLabel => PossessionStatusId switch {
        1 => "Ready to Move", 2 => "Under Construction", 3 => "New Launch", _ => "Ready to Move"
    };
}
