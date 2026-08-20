from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sympy import symbols, solve, Eq, simplify, factor, Rational, latex, S
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor
import re
import os

app = FastAPI(title="Algebra Helper API")

TRANSFORMATIONS = standard_transformations + (implicit_multiplication_application, convert_xor)

# CORS для локальной разработки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

x = symbols('x')

# Базовый класс для всех решателей (паттерн "Стратегия")
class BaseSolver:
    def can_solve(self, equation_str: str) -> bool:
        """Проверяет, может ли данный решатель обработать уравнение"""
        raise NotImplementedError
    
    def solve(self, equation_str: str) -> Dict[str, Any]:
        """Решает уравнение и возвращает результат"""
        raise NotImplementedError

# Решатель линейных уравнений: ax + b = 0
class LinearSolver(BaseSolver):
    def can_solve(self, equation_str: str) -> bool:
        try:
            left, right = equation_str.split('=')
            expr = parse_expr(f"({left}) - ({right})", transformations=TRANSFORMATIONS)
            poly = expr.as_poly(x)
            return poly is not None and poly.degree() == 1
        except:
            return False
    
    def solve(self, equation_str: str) -> Dict[str, Any]:
        try:
            left, right = equation_str.split('=')
            expr = parse_expr(f"({left}) - ({right})", transformations=TRANSFORMATIONS)
            
            poly = expr.as_poly(x)
            a = poly.coeff_monomial(x)
            b = poly.coeff_monomial(1)
            
            steps = [
                f"Дано уравнение: ${latex(expr)} = 0$",
                f"Переносим свободный член в правую часть: ${latex(a)}x = {latex(-b)}$",
                f"Делим обе части на коэффициент при x: $x = \\frac{{{latex(-b)}}}{{{latex(a)}}}$"
            ]
            
            solution = solve(expr, x)
            roots = [str(sol.evalf()) if sol.is_real else str(sol) for sol in solution]
            
            return {
                "type": "Линейное уравнение",
                "domain": "ОДЗ: $x \\in \\mathbb{R}$",
                "steps": steps,
                "roots": roots
            }
        except Exception as e:
            return {"error": f"Ошибка решения: {str(e)}"}

# Решатель квадратных уравнений: ax² + bx + c = 0
class QuadraticSolver(BaseSolver):
    def can_solve(self, equation_str: str) -> bool:
        try:
            left, right = equation_str.split('=')
            expr = parse_expr(f"({left}) - ({right})", transformations=TRANSFORMATIONS)
            poly = expr.as_poly(x)
            return poly is not None and poly.degree() == 2
        except:
            return False
    
    def solve(self, equation_str: str) -> Dict[str, Any]:
        try:
            left, right = equation_str.split('=')
            expr = parse_expr(f"({left}) - ({right})", transformations=TRANSFORMATIONS)
            
            poly = expr.as_poly(x)
            a = poly.coeff_monomial(x**2)
            b = poly.coeff_monomial(x)
            c = poly.coeff_monomial(1)
            
            steps = [
                f"Дано квадратное уравнение: ${latex(a)}x^2 + {latex(b)}x + {latex(c)} = 0$",
                f"Вычисляем дискриминант: $D = b^2 - 4ac = {latex(b)}^2 - 4 \\cdot {latex(a)} \\cdot {latex(c)}$"
            ]
            
            D = b**2 - 4*a*c
            steps.append(f"$D = {latex(D)}$")
            
            if D > 0:
                steps.append(f"Так как $D > 0$, уравнение имеет два различных корня")
                steps.append(f"$x_{{1,2}} = \\frac{{-b \\pm \\sqrt{{D}}}}{{2a}} = \\frac{{-{latex(b)} \\pm \\sqrt{{{latex(D)}}}}}{{2 \\cdot {latex(a)}}}$")
            elif D == 0:
                steps.append(f"Так как $D = 0$, уравнение имеет один корень (кратности 2)")
                steps.append(f"$x = \\frac{{-b}}{{2a}} = \\frac{{-{latex(b)}}}{{2 \\cdot {latex(a)}}}$")
            else:
                steps.append(f"Так как $D < 0$, уравнение не имеет действительных корней")
            
            solution = solve(expr, x)
            roots = []
            for sol in solution:
                if sol.is_real:
                    roots.append(str(sol.evalf()))
                else:
                    roots.append(str(sol))
            
            return {
                "type": "Квадратное уравнение",
                "domain": "ОДЗ: $x \\in \\mathbb{R}$",
                "steps": steps,
                "roots": roots
            }
        except Exception as e:
            return {"error": f"Ошибка решения: {str(e)}"}

# Решатель биквадратных уравнений: ax⁴ + bx² + c = 0
class BiquadraticSolver(BaseSolver):
    def can_solve(self, equation_str: str) -> bool:
        try:
            left, right = equation_str.split('=')
            expr = parse_expr(f"({left}) - ({right})", transformations=TRANSFORMATIONS)
            poly = expr.as_poly(x)
            if poly is None or poly.degree() != 4:
                return False
            terms = poly.terms()
            for term in terms:
                degree = term[0][0]
                if degree not in [0, 2, 4]:
                    return False
            return True
        except:
            return False
    
    def solve(self, equation_str: str) -> Dict[str, Any]:
        try:
            left, right = equation_str.split('=')
            expr = parse_expr(f"({left}) - ({right})", transformations=TRANSFORMATIONS)
            
            poly = expr.as_poly(x)
            a = poly.coeff_monomial(x**4)
            b = poly.coeff_monomial(x**2)
            c = poly.coeff_monomial(1)
            
            t = symbols('t')
            t_expr = a*t**2 + b*t + c
            
            steps = [
                f"Дано биквадратное уравнение: ${latex(a)}x^4 + {latex(b)}x^2 + {latex(c)} = 0$",
                f"Вводим замену: $t = x^2$, где $t \\geq 0$",
                f"Получаем квадратное уравнение относительно t: ${latex(a)}t^2 + {latex(b)}t + {latex(c)} = 0$"
            ]
            
            t_solutions = solve(t_expr, t)
            
            final_roots = []
            for t_sol in t_solutions:
                if t_sol.is_real and t_sol >= 0:
                    steps.append(f"Находим $t = {latex(t_sol)} \\geq 0$ — подходит")
                    x_sols = solve(Eq(x**2, t_sol), x)
                    for x_sol in x_sols:
                        final_roots.append(str(x_sol.evalf()))
                        steps.append(f"$x^2 = {latex(t_sol)} \\Rightarrow x = \\pm\\sqrt{{{latex(t_sol)}}} = \\pm{latex(x_sol)}$")
                elif t_sol.is_real and t_sol < 0:
                    steps.append(f"Находим $t = {latex(t_sol)} < 0$ — не подходит (так как $t \\geq 0$)")
                else:
                    steps.append(f"Находим $t = {latex(t_sol)}$ — комплексное число, не подходит")
            
            return {
                "type": "Биквадратное уравнение",
                "domain": "ОДЗ: $x \\in \\mathbb{R}$",
                "steps": steps,
                "roots": final_roots
            }
        except Exception as e:
            return {"error": f"Ошибка решения: {str(e)}"}

# Решатель дробно-рациональных уравнений: P(x)/Q(x) = 0
class RationalSolver(BaseSolver):
    def can_solve(self, equation_str: str) -> bool:
        try:
            return '/' in equation_str and '=' in equation_str
        except:
            return False
    
    def solve(self, equation_str: str) -> Dict[str, Any]:
        try:
            left, right = equation_str.split('=')
            
            left_expr = parse_expr(f"({left})", transformations=TRANSFORMATIONS)
            right_expr = parse_expr(f"({right})", transformations=TRANSFORMATIONS)
            
            expr = left_expr - right_expr
            
            numer, denom = expr.as_numer_denom()
            
            steps = [
                f"Дано дробно-рациональное уравнение: ${latex(left_expr)} = {latex(right_expr)}$",
                f"Переносим все в одну часть: ${latex(expr)} = 0$",
                f"ОДЗ: знаменатель не равен нулю: ${latex(denom)} \\neq 0$"
            ]
            
            denom_roots = solve(denom, x)
            if denom_roots:
                restrictions = [f"x \\neq {latex(r)}" for r in denom_roots]
                steps.append(f"Ограничения ОДЗ: ${', '.join(restrictions)}$")
            
            numer_solutions = solve(numer, x)
            
            valid_roots = []
            for sol in numer_solutions:
                is_valid = True
                for denom_root in denom_roots:
                    if simplify(sol - denom_root) == 0:
                        is_valid = False
                        steps.append(f"$x = {latex(sol)}$ не подходит (обращает знаменатель в ноль)")
                        break
                
                if is_valid:
                    if sol.is_real:
                        valid_roots.append(str(sol.evalf()))
                    else:
                        valid_roots.append(str(sol))
                    steps.append(f"$x = {latex(sol)}$ — подходит")
            
            return {
                "type": "Дробно-рациональное уравнение",
                "domain": f"ОДЗ: ${latex(denom)} \\neq 0$",
                "steps": steps,
                "roots": valid_roots
            }
        except Exception as e:
            return {"error": f"Ошибка решения: {str(e)}"}

# Главный решатель
class EquationSolver:
    def __init__(self):
        self.solvers = [
            LinearSolver(),
            QuadraticSolver(),
            BiquadraticSolver(),
            RationalSolver()
        ]
    
    def solve(self, equation_str: str) -> Dict[str, Any]:
        for solver in self.solvers:
            if solver.can_solve(equation_str):
                return solver.solve(equation_str)
        
        return {
            "error": "Не удалось определить тип уравнения или уравнение не поддерживается"
        }

# Модели запроса/ответа
class SolveRequest(BaseModel):
    query: str

class SolveResponse(BaseModel):
    type: Optional[str] = None
    domain: Optional[str] = None
    steps: Optional[List[str]] = None
    roots: Optional[List[str]] = None
    error: Optional[str] = None

solver = EquationSolver()

@app.post("/api/solve", response_model=SolveResponse)
async def solve_equation(request: SolveRequest):
    try:
        result = solver.solve(request.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Раздача статических файлов (index.html)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
