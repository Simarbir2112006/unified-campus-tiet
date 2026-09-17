def test_list_professors_returns_created_rows(client, sample_professors):
    response = client.get("/professors")
    assert response.status_code == 200
    names = {p["name"] for p in response.json()}
    assert {"Test Professor Alpha", "Test Professor Beta"}.issubset(names)


def test_search_matches_name(client, sample_professors):
    response = client.get("/professors", params={"search": "Alpha"})
    assert response.status_code == 200
    names = [p["name"] for p in response.json()]
    assert names == ["Test Professor Alpha"]


def test_search_matches_subjects(client, sample_professors):
    response = client.get("/professors", params={"search": "Thermodynamics"})
    assert response.status_code == 200
    names = [p["name"] for p in response.json()]
    assert "Test Professor Beta" in names


def test_department_filter(client, sample_professors):
    response = client.get("/professors", params={"department": "Mechanical"})
    assert response.status_code == 200
    names = [p["name"] for p in response.json()]
    assert names == ["Test Professor Beta"]


def test_department_filter_all_returns_everything(client, sample_professors):
    response = client.get("/professors", params={"department": "All"})
    assert response.status_code == 200
    names = {p["name"] for p in response.json()}
    assert {"Test Professor Alpha", "Test Professor Beta"}.issubset(names)


def test_departments_endpoint_lists_distinct_values(client, sample_professors):
    response = client.get("/professors/departments")
    assert response.status_code == 200
    assert {"Computer Science", "Mechanical"}.issubset(set(response.json()))


def test_get_professor_by_id_returns_full_profile(client, sample_professors):
    target = sample_professors[0]
    response = client.get(f"/professors/{target.id}")
    assert response.status_code == 200
    body = response.json()
    assert body["official_email"] == target.official_email
    assert body["department"] == target.department


def test_get_professor_not_found_returns_404(client):
    response = client.get("/professors/999999999")
    assert response.status_code == 404


def test_get_professor_invalid_id_returns_422(client):
    response = client.get("/professors/not-an-id")
    assert response.status_code == 422
