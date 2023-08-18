﻿using JiraSchedulingConnectAppService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelLibrary.DTOs;
using ModelLibrary.DTOs.Skills;
using UtilsLibrary;

namespace JiraSchedulingConnectAppService.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class SkillsController : ControllerBase
    {

        private readonly ISkillsService skillsService;
        private readonly ILoggerManager _Logger;
        public SkillsController(ISkillsService skillsService, ILoggerManager logger)
        {

            _Logger = logger;
            this.skillsService = skillsService;
        }

        [HttpGet]
        async public Task<IActionResult> GetSkills(string? name)
        {
            try
            {
                var response = await skillsService.GetSkills(name);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _Logger.LogError(ex.Message);
                var response = new ResponseMessageDTO(ex.Message);
                return BadRequest(response);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateSkill([FromBody] SkillCreatedRequest skillRequest)
        {
            try
            {
                var response = await skillsService.CreateSkill(skillRequest);
                return Ok(response);
            }

            catch (Exception ex)
            {

                _Logger.LogError(ex.Message);
                var response = new ResponseMessageDTO(ex.Message);
                return BadRequest(response);
            }
        }


        [HttpPut]
        async public Task<IActionResult> UpdateNameSkill([FromBody] SkillDTOResponse skill)
        {
            try
            {

                // update skill name
                var result = await skillsService.UpdateNameSkill(skill);
                var response = new ResponseMessageDTO(Const.MESSAGE.SUCCESS);
                response.Data = result;

                return Ok(response);
            }
            catch (Exception ex)
            {
                _Logger.LogError(ex.Message);
                var response = new ResponseMessageDTO(ex.Message);
                return BadRequest(response);
            }
        }

        [HttpDelete]
        async public Task<IActionResult> DeleteSkill(int id)
        {
            try
            {
                var response = await skillsService.DeleteSkill(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _Logger.LogError(ex.Message);
                var response = new ResponseMessageDTO(ex.Message);
                return BadRequest(response);
            }
        }

    }
}
