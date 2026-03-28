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

    // POST /api/user/register  { name, role, email, password }
    @PostMapping("/user/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name     = body.get("name");
        String role     = body.get("role");
        String email    = body.get("email");
        String password = body.get("password");

        if (name == null || name.isBlank())     return ResponseEntity.badRequest().body("Введіть імʼя");
        if (role == null || role.isBlank())     return ResponseEntity.badRequest().body("Оберіть роль");
        if (email == null || email.isBlank())   return ResponseEntity.badRequest().body("Введіть email");
        if (password == null || password.length() < 6) return ResponseEntity.badRequest().body("Пароль мінімум 6 символів");

        User user = dataService.registerUser(name, role, email, password);
        if (user == null) return ResponseEntity.badRequest().body("Email вже зареєстровано");
        return ResponseEntity.ok(safeUser(user));
    }

    // POST /api/user/login  { email, password }
    @PostMapping("/user/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");

        if (email == null || email.isBlank())    return ResponseEntity.badRequest().body("Введіть email");
        if (password == null || password.isBlank()) return ResponseEntity.badRequest().body("Введіть пароль");

        User user = dataService.loginUser(email.trim().toLowerCase(), password);
        if (user == null) return ResponseEntity.status(401).body("Невірний email або пароль");
        return ResponseEntity.ok(safeUser(user));
    }

    // GET /api/users
    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(
            dataService.getAllUsers().stream().map(this::safeUser).toList()
        );
    }

    // PUT /api/users/{id}/role  { role }
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        if (!dataService.updateUserRole(id, body.get("role")))
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }

    // DELETE /api/users/{id}
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        if (!dataService.deleteUser(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }

    // Safe user (without password)
    private Map<String, String> safeUser(User u) {
        return Map.of(
            "id",    u.getId(),
            "name",  u.getName(),
            "role",  u.getRole(),
            "code",  u.getCode(),
            "email", u.getEmail() != null ? u.getEmail() : ""
        );
    }

    // ======= TEAMS =======

    @PostMapping("/teams")
    public ResponseEntity<?> createTeam(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) return ResponseEntity.badRequest().body("Введіть назву");
        return ResponseEntity.ok(dataService.createTeam(name.trim()));
    }

    @GetMapping("/teams")
    public List<Team> getTeams() {
        return dataService.getAllTeams();
    }

    @PostMapping("/teams/{id}/members/code")
    public ResponseEntity<?> addMemberByCode(@PathVariable String id, @RequestBody Map<String, String> body) {
        if (!dataService.addMemberByCode(id, body.get("code")))
            return ResponseEntity.badRequest().body("Код не знайдено або учасник вже є");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/teams/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable String id, @RequestBody Map<String, String> body) {
        if (!dataService.addMemberByName(id, body.get("name")))
            return ResponseEntity.badRequest().body("Помилка додавання");
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/teams/{id}/members/{index}")
    public ResponseEntity<?> removeMember(@PathVariable String id, @PathVariable int index) {
        if (!dataService.removeMember(id, index)) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/teams/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable String id) {
        if (!dataService.deleteTeam(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }

    // ======= TOURNAMENTS =======

    @PostMapping("/tournaments")
    public ResponseEntity<?> createTournament(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) return ResponseEntity.badRequest().body("Введіть назву");
        return ResponseEntity.ok(dataService.createTournament(name.trim(), body.get("createdBy")));
    }

    @GetMapping("/tournaments")
    public List<Tournament> getTournaments() {
        return dataService.getAllTournaments();
    }

    @PostMapping("/tournaments/{id}/teams")
    public ResponseEntity<?> addTeamToTournament(@PathVariable String id, @RequestBody Map<String, String> body) {
        if (!dataService.addTeamToTournament(id, body.get("teamCode")))
            return ResponseEntity.badRequest().body("Команду не знайдено або вже додана");
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/tournaments/{tid}/teams/{teamId}")
    public ResponseEntity<?> removeTeamFromTournament(@PathVariable String tid, @PathVariable String teamId) {
        if (!dataService.removeTeamFromTournament(tid, teamId)) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok().build();
    }

    @PutMapping("/tournaments/{id}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable String id) {
        if (!dataService.toggleTournamentStatus(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/tournaments/{id}")
    public ResponseEntity<?> deleteTournament(@PathVariable String id) {
        if (!dataService.deleteTournament(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }
}
