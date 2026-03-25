package com.joust.tournament.controllers;

import com.joust.tournament.models.Team;
import com.joust.tournament.models.Tournament;
import com.joust.tournament.models.User;
import com.joust.tournament.services.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private DataService dataService;

    // ======= USERS =======

    // POST /api/users/register  { name, role }
    @PostMapping("/users/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String role = body.get("role");
        if (name == null || name.isBlank()) return ResponseEntity.badRequest().body("Введіть імʼя");
        if (role == null || role.isBlank()) return ResponseEntity.badRequest().body("Оберіть роль");
        User user = dataService.registerUser(name.trim(), role);
        return ResponseEntity.ok(user);
    }

    // GET /api/users
    @GetMapping("/users")
    public List<User> getUsers() {
        return dataService.getAllUsers();
    }

    // PUT /api/users/{id}/role  { role }
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        if (!dataService.updateUserRole(id, role))
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }

    // DELETE /api/users/{id}
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        if (!dataService.deleteUser(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }

    // ======= TEAMS =======

    // POST /api/teams  { name }
    @PostMapping("/teams")
    public ResponseEntity<?> createTeam(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) return ResponseEntity.badRequest().body("Введіть назву");
        return ResponseEntity.ok(dataService.createTeam(name.trim()));
    }

    // GET /api/teams
    @GetMapping("/teams")
    public List<Team> getTeams() {
        return dataService.getAllTeams();
    }

    // POST /api/teams/{id}/members/code  { code }  — додати за кодом профілю
    @PostMapping("/teams/{id}/members/code")
    public ResponseEntity<?> addMemberByCode(@PathVariable String id, @RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (!dataService.addMemberByCode(id, code))
            return ResponseEntity.badRequest().body("Код не знайдено або учасник вже є");
        return ResponseEntity.ok().build();
    }

    // POST /api/teams/{id}/members  { name }  — додати вручну
    @PostMapping("/teams/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable String id, @RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (!dataService.addMemberByName(id, name))
            return ResponseEntity.badRequest().body("Помилка додавання");
        return ResponseEntity.ok().build();
    }

    // DELETE /api/teams/{id}/members/{index}
    @DeleteMapping("/teams/{id}/members/{index}")
    public ResponseEntity<?> removeMember(@PathVariable String id, @PathVariable int index) {
        if (!dataService.removeMember(id, index)) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok().build();
    }

    // DELETE /api/teams/{id}
    @DeleteMapping("/teams/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable String id) {
        if (!dataService.deleteTeam(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }

    // ======= TOURNAMENTS =======

    // POST /api/tournaments  { name, createdBy }
    @PostMapping("/tournaments")
    public ResponseEntity<?> createTournament(@RequestBody Map<String, String> body) {
        String name      = body.get("name");
        String createdBy = body.get("createdBy");
        if (name == null || name.isBlank()) return ResponseEntity.badRequest().body("Введіть назву");
        return ResponseEntity.ok(dataService.createTournament(name.trim(), createdBy));
    }

    // GET /api/tournaments
    @GetMapping("/tournaments")
    public List<Tournament> getTournaments() {
        return dataService.getAllTournaments();
    }

    // POST /api/tournaments/{id}/teams  { teamCode }
    @PostMapping("/tournaments/{id}/teams")
    public ResponseEntity<?> addTeam(@PathVariable String id, @RequestBody Map<String, String> body) {
        String teamCode = body.get("teamCode");
        if (!dataService.addTeamToTournament(id, teamCode))
            return ResponseEntity.badRequest().body("Команду не знайдено або вже додана");
        return ResponseEntity.ok().build();
    }

    // DELETE /api/tournaments/{tid}/teams/{teamId}
    @DeleteMapping("/tournaments/{tid}/teams/{teamId}")
    public ResponseEntity<?> removeTeam(@PathVariable String tid, @PathVariable String teamId) {
        if (!dataService.removeTeamFromTournament(tid, teamId)) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok().build();
    }

    // PUT /api/tournaments/{id}/status
    @PutMapping("/tournaments/{id}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable String id) {
        if (!dataService.toggleTournamentStatus(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }

    // DELETE /api/tournaments/{id}
    @DeleteMapping("/tournaments/{id}")
    public ResponseEntity<?> deleteTournament(@PathVariable String id) {
        if (!dataService.deleteTournament(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }
}
