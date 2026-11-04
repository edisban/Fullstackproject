import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderApp } from "@/test/render";
import { db, makeProject, makeStudent, signedInAs } from "@/test/server";

describe("Dashboard", () => {
  beforeEach(() => {
    signedInAs("alice");
  });

  it("shows totals, the activity chart as a table, top projects and recent students", async () => {
    const apollo = makeProject({ name: "Apollo", studentCount: 2 });
    db.projects = [apollo, makeProject({ name: "Gemini", studentCount: 0 })];
    db.students = [
      makeStudent({ projectId: apollo.id, firstName: "Ada", lastName: "Lovelace" }),
      makeStudent({ projectId: apollo.id, firstName: "Alan", lastName: "Turing" }),
    ];
    renderApp("/dashboard");

    expect(await screen.findByRole("heading", { name: /, alice$/ })).toBeInTheDocument();
    // The greeting renders immediately; wait for the figures to load.
    expect(
      await within(screen.getByRole("group", { name: "Projects" })).findByText("2"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("group", { name: "Students" })).getByText("2"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("group", { name: "Avg. per project" })).getByText("1.0"),
    ).toBeInTheDocument();

    // Accessible data table behind the chart.
    const table = screen.getByRole("table", { name: "Students added per day" });
    expect(within(table).getAllByRole("row")).toHaveLength(15);
    expect(
      screen.getByRole("img", { name: /2 students added over the last 14 days/ }),
    ).toBeInTheDocument();

    expect(
      within(screen.getByRole("region", { name: "Largest projects" })).getByRole("link", {
        name: "Apollo",
      }),
    ).toHaveAttribute("href", expect.stringMatching(/\/projects\/\d+$/));
    expect(screen.getByText("Alan Turing")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Set up your workspace in three steps" }),
    ).not.toBeInTheDocument();
  });
});
