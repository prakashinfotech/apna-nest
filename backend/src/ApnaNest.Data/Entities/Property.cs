namespace ApnaNest.Data.Entities;

public class Property
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public Guid CityId { get; set; }
    public Guid LocalityId { get; set; }
    public string? AddressLine { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? PinCode { get; set; }
    public short PropertyTypeId { get; set; }
    public short ListingIntentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public short? Bhk { get; set; }
    public short? Bathrooms { get; set; }
    public decimal AreaSqft { get; set; }
    public decimal Price { get; set; }
    public bool IsReraVerified { get; set; }
    public bool IsZeroBrokerage { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }


    // Helper for bulk creation
    public List<string> ImageUrls { get; set; } = new();
}

