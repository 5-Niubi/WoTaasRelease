﻿using ModelLibrary.DTOs.Parameters;

namespace JiraSchedulingConnectAppService.Services.Interfaces
{
    public interface IValidatorService
    {
        public Task<bool> IsValidDAG(int projectId);

        public Task<bool> IsValidRequiredParameters(ParameterRequestDTO parameterRequest);
    }
}

