using JiraSchedulingConnectAppService.MiddleWare;
using JiraSchedulingConnectAppService.Services;
using JiraSchedulingConnectAppService.Services.Authorization;
using JiraSchedulingConnectAppService.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ModelLibrary.DBModels;
using ModelLibrary.DTOs;
using NLog;
using NLog.Web;
using System.Text;
using static UtilsLibrary.Const;

var logger = NLog.LogManager.Setup().LoadConfigurationFromFile("nlog.config").GetCurrentClassLogger();
try
{
    logger.Info("Start Game...");
    var builder = WebApplication.CreateBuilder(args);

    // Config log provider
    builder.Host.ConfigureLogging(logging =>
    {
        logging.ClearProviders();
    }).UseNLog();
    builder.Services.AddLogging();

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var test = builder.Configuration.GetConnectionString(" ");
    // Custom Config
    builder.Services.AddCors();
    builder.Services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);
    builder.Services.AddDbContext<WoTaasContext>(opt => opt.UseSqlServer(
        builder.Configuration.GetConnectionString("DB")
        )
    );

    builder.Services.AddHttpContextAccessor();
    builder.Services.AddControllersWithViews();

    // Register services
    builder.Services.AddTransient<ILoggerManager, LoggerManager>();
    builder.Services.AddTransient<IAPIMicroserviceService, APIMicroserviceService>();
    builder.Services.AddTransient<IProjectServices, ProjectsService>();
    builder.Services.AddTransient<ISkillsService, SkillsService>();
    builder.Services.AddTransient<ITasksService, TasksService>();
    builder.Services.AddTransient<IAlgorithmService, AlgorithmService>();
    builder.Services.AddTransient<IValidatorService, ScheduleValidatorService>();
    builder.Services.AddTransient<IParametersService, ParametersService>();
    builder.Services.AddTransient<IWorkforcesService, WorkforcesService>();
    builder.Services.AddTransient<IEquipmentService, EquipmentsService>();
    builder.Services.AddTransient<IJiraBridgeAPIService, JiraBridgeAPIService>();
    builder.Services.AddTransient<IAuthenticationService, AuthenticationService>();
    builder.Services.AddTransient<IExportService, ExportService>();
    builder.Services.AddTransient<IThreadService, ThreadService>();
    builder.Services.AddTransient<IScheduleService, ScheduleService>();
    builder.Services.AddTransient<IMilestonesService, MilestonesService>();
    builder.Services.AddTransient<ISubscriptionService, SubscriptionService>();
    builder.Services.AddTransient<IAuthorizationHandler, ScheduleLimitHandler>();
    builder.Services.AddTransient<IPermissionService, PermissionService>();
    builder.Services.AddTransient<IAuthorizationHandler, ProjectLimitHandler>();
    //builder.Services.AddTransient<IAuthorizationHandler, ProjectLimitHandler>();

    // Config Policy
    //builder.Services.AddHeimGuard<UserPolicyHandler>()
    // .AutomaticallyCheckPermissions()
    // .MapAuthorizationPolicies();

    builder.Services.AddAuthorization(
        options =>
        {
            options.AddPolicy(
                "LimitedScheduleTimeByDay", policy => policy.Requirements.Add(new ScheduleLimitRequirement(LIMITED_PLAN.LIMIT_DAILY_EXECUTE_ALGORITHM)));
            options.AddPolicy(
                "LimitedCreateProject", policy => policy.Requirements.Add(new ProjectLimitRequirement(LIMITED_PLAN.LIMIT_CREATE_NEW_PROJECT)));
        });

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    app.UseStaticFiles();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    // Custom Config:
    app.UseCors(opt => opt.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

    // To get ip address
    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    });
    app.UseGetRequestIPMiddleWare();
    // end code to add
    await app.RunAsync();
}
catch (Exception ex)
{
    logger.Error(ex, "Stopped program because of exception");
    throw;
}
finally
{
    NLog.LogManager.Shutdown();
}
