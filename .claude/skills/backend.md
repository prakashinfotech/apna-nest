# Backend Development Skills

This document provides specific patterns and "skills" for developing the ApnaNest backend (.NET).

## 1. Implementing a New Feature (CQRS)
- **Convention**: Use MediatR for Commands and Queries.
- **Pattern**:
  1. Define a `Command` or `Query` record in the Application layer.
  2. Implement a `Validator` using FluentValidation.
  3. Implement a `Handler`.
  4. Use the `Result<T>` pattern for the return type.
- **Example**:
  ```csharp
  public record CreatePropertyCommand(string Title, decimal Price) : IRequest<Result<Guid>>;

  public class CreatePropertyValidator : AbstractValidator<CreatePropertyCommand> {
      public CreatePropertyValidator() {
          RuleFor(x => x.Title).NotEmpty();
          RuleFor(x => x.Price).GreaterThan(0);
      }
  }

  public class CreatePropertyHandler : IRequestHandler<CreatePropertyCommand, Result<Guid>> {
      public async Task<Result<Guid>> Handle(CreatePropertyCommand request, CancellationToken ct) {
          // Logic here
          return Result.Success(id);
      }
  }
  ```

## 2. Entity Configuration (EF Core)
- **Convention**: Use `IEntityTypeConfiguration<T>`.
- **Pattern**:
  - Keep entities clean (no data annotations).
  - Define mappings in the Infrastructure layer.
- **Example**:
  ```csharp
  public class PropertyConfiguration : IEntityTypeConfiguration<Property> {
      public void Configure(EntityTypeBuilder<Property> builder) {
          builder.ToTable("properties");
          builder.HasKey(x => x.Id);
          builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
      }
  }
  ```

## 3. API Controllers
- **Convention**: Slim controllers that delegate to MediatR.
- **Pattern**:
  - Use `[ApiController]` and `[Route("api/[controller]")]`.
  - Inject `ISender` (MediatR).
  - Map `Result<T>` to appropriate `ActionResult`.
- **Example**:
  ```csharp
  [HttpPost]
  public async Task<IActionResult> Create(CreatePropertyCommand command) {
      var result = await _sender.Send(command);
      return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
  }
  ```

## 4. Error Handling
- **Convention**: Use Middleware for global exceptions, Result pattern for business logic errors.
- **Pattern**:
  - Catch truly exceptional cases in a global `ExceptionMiddleware`.
  - Return `Result.Failure(Error.Validation(...))` for validation issues.

## 5. Dependency Injection
- **Convention**: Use `IServiceCollection` extensions to register services.
- **Pattern**:
  - Create `AddApplication`, `AddInfrastructure` extensions.
  - Register interfaces with their implementations.
