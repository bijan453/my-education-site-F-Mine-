# ============================================================
# УМНЫЙ ПОМОЩНИК ПО АЛГЕБРЕ (7–11 класс) — FastAPI + SymPy
# Паттерн "Стратегия": BaseSolver + солверы для каждой темы
# ============================================================
import os, re
import sympy as sp
from sympy import (symbols, solve, Eq, simplify, factor, expand, latex, sqrt,
                   Abs, Rational, S, diff, integrate, sin, cos, tan, log,
                   together, cancel, solveset, reduce_inequalities, Poly,
                   Interval, Union, oo, pi)
from sympy.parsing.sympy_parser import (parse_expr, standard_transformations,
    implicit_multiplication_application, convert_xor)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional

BASE = os.path.dirname(os.path.abspath(__file__))
app = FastAPI(title="Algebra Helper API")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

x, y, t, a, b, k = symbols('x y t a b k')

# ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----------
TRANSF = standard_transformations + (implicit_multiplication_application, convert_xor)

def preprocess(s: str) -> str:
    """Приводит пользовательский ввод к виду, понятному парсеру."""
    s = s.replace('√', 'sqrt').replace('·', '*').replace('−', '-')
    s = s.replace('≤', '<=').replace('≥', '>=').replace('π', 'pi')
    s = s.replace('’', "'").replace('’', "'")
    s = s.replace('ln(', 'log(')
    # log2(...) или log_2(...) или log0.5(...) -> log_base(2, ...)
    s = re.sub(r'log_?(\d+(?:\.\d+)?)\s*\(', r'log_base(\1, ', s)
    # |...| -> Abs(...)
    while '|' in s:
        i = s.find('|'); j = s.find('|', i + 1)
        if j == -1: break
        s = s[:i] + 'Abs(' + s[i+1:j] + ')' + s[j+1:]
    return s

LOG_BASE = {'log_base': lambda b, e: sp.log(e, b)}

def parse(s: str):
    return parse_expr(preprocess(s), transformations=TRANSF, local_dict=LOG_BASE)

REL_OPS = ['<=', '>=', '<', '>', '=']

def split_rel(q: str):
    """Разбивает строку на (левая, оператор, правая)."""
    for op in REL_OPS:
        if op in q:
            i = q.find(op)
            return q[:i], op, q[i+len(op):]
    return None

def make_rel(l, r, op):
    return {'=': Eq(l, r), '<': sp.Lt(l, r), '>': sp.Gt(l, r),
            '<=': sp.Le(l, r), '>=': sp.Ge(l, r)}[op]

def tex(e) -> str:
    """Красивый LaTeX для выражения/числа."""
    try:
        e = sp.simplify(e)
        if e.is_number and not e.is_rational:
            f = float(e)
            if abs(f - round(f)) < 1e-9: return str(int(round(f)))
            return str(round(f, 4))
        return latex(e)
    except Exception:
        return str(e)

def pretty(e) -> str:
    """Короткая строка для ответа."""
    try:
        e = sp.simplify(e)
        if e.is_number:
            if e.is_rational: return str(e)
            f = float(e)
            if abs(f - round(f)) < 1e-9: return str(int(round(f)))
            return str(round(f, 4))
        return str(e)
    except Exception:
        return str(e)

def linear_coefs(e, sym):
    """Если e линейно по sym, возвращает (m, c), иначе None."""
    try:
        p = Poly(e, sym)
        if p.degree() <= 1:
            return p.coeff_monomial(sym), p.coeff_monomial(1)
    except Exception:
        pass
    return None

def has_x_exp(expr):
    return any(p.exp.has(x) for p in expr.atoms(sp.Pow)
               if p.base.is_number or p.base.has(x))

def square_part(n):
    fi = sp.factorint(int(n)); s = 1
    for p, e in fi.items(): s *= p ** (e // 2)
    return s

def solve_set(rel, sym=x):
    """Решает неравенство/уравнение -> множество (интервалы)."""
    try:
        return solveset(rel, sym, S.Reals)
    except Exception:
        try:
            return reduce_inequalities(rel, sym)
        except Exception:
            return None

class BaseSolver:
    name = "base"
    def can_solve(self, q: str) -> bool: raise NotImplementedError
    def solve(self, q: str) -> dict: raise NotImplementedError
    def result(self, typ, steps, roots, domain="ОДЗ: $x \\in \\mathbb{R}$"):
        return {"type": typ, "domain": domain, "steps": steps, "roots": roots}

# ---------- 7 КЛАСС: ПРОГРЕССИИ (a1=2, d=3, n=10) ----------
class ProgressionSolver(BaseSolver):
    def can_solve(self, q):
        return bool(re.search(r'(a_?1|b_?1|[dq])\s*=', q)) or 'прогресс' in q.lower()
    def solve(self, q):
        vals = dict(re.findall(r'([abdnqS])_?(\d*)\s*=\s*(-?\d+(?:[.,]\d+)?)', q))
        get = lambda kk: Rational(str(vals[kk]).replace(',', '.')) if kk in vals else None
        steps, roots = [], []
        if 'd' in vals:                      # арифметическая
            a1, d, n = get('a'), get('d'), get('n')
            steps.append("Дана **арифметическая прогрессия**")
            steps.append(f"Формула n-го члена: $a_n = a_1 + d(n-1)$")
            if a1 is not None and d is not None and n is not None:
                an = a1 + d * (n - 1)
                steps.append(f"Подставляем: $a_{{{pretty(n)}}} = {pretty(a1)} + {pretty(d)} \\cdot ({pretty(n)}-1) = {pretty(an)}$")
                Sn = (a1 + an) * n / 2
                steps.append(f"Формула суммы: $S_n = \\frac{{(a_1 + a_n) \\cdot n}}{{2}}$")
                steps.append(f"$S_{{{pretty(n)}}} = \\frac{{({pretty(a1)} + {pretty(an)}) \\cdot {pretty(n)}}}{{2}} = {pretty(Sn)}$")
                roots = [f"a_{pretty(n)} = {pretty(an)}", f"S_{pretty(n)} = {pretty(Sn)}"]
        elif 'q' in vals:                    # геометрическая
            b1, q_, n = get('b'), get('q'), get('n')
            steps.append("Дана **геометрическая прогрессия**")
            steps.append(f"Формула n-го члена: $b_n = b_1 \\cdot q^{{n-1}}$")
            if b1 is not None and q_ is not None and n is not None:
                bn = b1 * q_ ** (n - 1)
                steps.append(f"Подставляем: $b_{{{pretty(n)}}} = {pretty(b1)} \\cdot {pretty(q_)}^{{{pretty(n)}-1}} = {pretty(bn)}$")
                Sn = b1 * (q_ ** n - 1) / (q_ - 1)
                steps.append(f"Формула суммы: $S_n = \\frac{{b_1 (q^n - 1)}}{{q - 1}}$")
                steps.append(f"$S_{{{pretty(n)}}} = \\frac{{{pretty(b1)} \\cdot ({pretty(q_)}^{{{pretty(n)}}} - 1)}}{{{pretty(q_)} - 1}} = {pretty(Sn)}$")
                roots = [f"b_{pretty(n)} = {pretty(bn)}", f"S_{pretty(n)} = {pretty(Sn)}"]
        return self.result("Прогрессия", steps, roots)

# ---------- 10 КЛАСС: ПРОИЗВОДНЫЕ ----------
class DerivativeSolver(BaseSolver):
    def can_solve(self, q):
        return "'" in q or 'производ' in q.lower() or 'd/dx' in q.lower()
    def solve(self, q):
        s = q.replace("'", "").replace("d/dx", "").replace("производная", "").strip()
        s = s.strip('()') if s.count('(') == s.count(')') and s.startswith('(') else s
        expr = parse(s)
        steps = [f"Находим производную: $\\left({tex(expr)}\\right)'$"]
        steps.append("Правило суммы: $(u+v)' = u' + v'$")
        if isinstance(expr, sp.Add):
            for term in expr.args:
                steps.append(f"$\\left({tex(term)}\\right)' = {tex(diff(term, x))}$  (правило степени: $(x^n)' = n x^{{n-1}}$)")
        res = diff(expr, x)
        steps.append(f"Итого: $\\left({tex(expr)}\\right)' = {tex(res)}$")
        return self.result("Производная", steps, [str(res)])

# ---------- 11 КЛАСС: ИНТЕГРАЛЫ ----------
class IntegralSolver(BaseSolver):
    def can_solve(self, q):
        return '∫' in q or 'интеграл' in q.lower()
    def solve(self, q):
        s = q.replace('∫', '').replace('интеграл', '').replace('dx', '').replace('d x', '').strip()
        expr = parse(s)
        steps = [f"Находим первообразную: $\\int \\left({tex(expr)}\\right) dx$"]
        steps.append("Правило: $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$")
        if isinstance(expr, sp.Add):
            for term in expr.args:
                steps.append(f"$\\int {tex(term)}\\, dx = {tex(integrate(term, x))}$")
        res = integrate(expr, x)
        steps.append(f"Ответ: $\\int \\left({tex(expr)}\\right) dx = {tex(res)} + C$")
        return self.result("Интеграл", steps, [f"{res} + C"])

# ---------- СИСТЕМЫ УРАВНЕНИЙ (линейные и нелинейные) ----------
class SystemSolver(BaseSolver):
    def can_solve(self, q):
        parts = self.parts(q)
        return parts is not None
    def parts(self, q):
        clean = q.replace('{', ' ').replace('}', ' ')
        ps = [p for p in re.split(r';|\n|,| и ', clean) if '=' in p and p.strip()]
        return ps if len(ps) >= 2 else None
    def solve(self, q):
        ps = self.parts(q)
        eqs = []
        for p in ps[:2]:
            l, _, r = split_rel(p)
            eqs.append(Eq(parse(l) - parse(r), 0))
        steps = [f"Дана система: $\\begin{{cases}} {tex(eqs[0].lhs - eqs[0].rhs)} = 0 \\\\ {tex(eqs[1].lhs - eqs[1].rhs)} = 0 \\end{{cases}}$"]
        sols = solve(eqs, [x, y], dict=True)
        # если одно уравнение линейное — показываем подстановку
        lin = None
        for i, e in enumerate(eqs):
            try:
                if Poly(e.lhs, [x, y]).total_degree() == 1: lin = i
            except Exception: pass
        if lin is not None:
            other = eqs[1 - lin]
            ys = solve(eqs[lin], y)
            if ys:
                yexpr = ys[0]
                steps.append(f"Из уравнения ({lin+1}) выражаем: $y = {tex(yexpr)}$")
                sub = other.lhs.subs(y, yexpr) - other.rhs.subs(y, yexpr)
                steps.append(f"Подставляем в уравнение ({2 - lin}): ${tex(simplify(sub))} = 0$")
        steps.append("Решаем полученное уравнение и находим пары $(x; y)$")
        roots = [f"x = {pretty(s[x])}, y = {pretty(s[y])}" for s in sols if x in s and y in s]
        return self.result("Система уравнений", steps, roots)

# ---------- УРАВНЕНИЯ И НЕРАВЕНСТВА С МОДУЛЕМ ----------
class AbsSolver(BaseSolver):
    def can_solve(self, q):
        return 'Abs' in preprocess(q) or '|' in q
    def solve(self, q):
        sr = split_rel(q)
        l, op, r = sr
        L, R = parse(l), parse(r)
        inner = None
        for atom in L.atoms(Abs): inner = atom.args[0]
        steps = [f"Дано: ${tex(L)} {op} {tex(R)}$"]
        if op == '=':
            c = R
            steps.append(f"Модуль равен числу: $|{tex(inner)}| = {tex(c)}$")
            if c.is_number and c < 0:
                steps.append("Так как $c < 0$, решений нет (модуль не может быть отрицательным)")
                return self.result("Уравнение с модулем", steps, [])
            steps.append(f"Раскрываем модуль: два случая — ${tex(inner)} = {tex(c)}$  или  ${tex(inner)} = -{tex(c)}$")
            s1 = solve(Eq(inner, c), x); s2 = solve(Eq(inner, -c), x)
            steps.append(f"Случай 1: $x = {', '.join(tex(s) for s in s1)}$")
            steps.append(f"Случай 2: $x = {', '.join(tex(s) for s in s2)}$")
            roots = [pretty(s) for s in s1 + s2]
        else:
            steps.append(f"Свойство модуля: $|f| {op} c$ решается через двойное неравенство")
            sol = solve_set(make_rel(L, R, op))
            steps.append(f"Решаем: ответ ${latex(sol)}$")
            roots = [str(sol)]
        return self.result("Уравнение/неравенство с модулем", steps, roots)

# ---------- ИРРАЦИОНАЛЬНЫЕ: КОРНИ ----------
class RadicalSolver(BaseSolver):
    def can_solve(self, q):
        return 'sqrt' in preprocess(q).lower() or '√' in q
    def solve(self, q):
        sr = split_rel(q)
        if sr is None:   # выражение: sqrt(75) - sqrt(12)
            expr = parse(q)
            steps = [f"Упрощаем выражение: ${tex(expr)}$"]
            for p in expr.atoms(sp.Pow):
                if p.exp == Rational(1, 2) and p.base.is_number:
                    n = int(p.base); s = square_part(n)
                    steps.append(f"$\\sqrt{{{n}}} = \\sqrt{{{s**2} \\cdot {n // s**2}}} = {s}\\sqrt{{{n // s**2}}}$")
            res = sp.radsimp(expr)
            steps.append(f"Приводим подобные: $= {tex(res)}$")
            return self.result("Иррациональное выражение", steps, [str(res)])
        l, op, r = sr
        L, R = parse(l), parse(r)
        inner = None
        for p in L.atoms(sp.Pow):
            if p.exp == Rational(1, 2): inner = p.base
        steps = [f"Дано: ${tex(L)} {op} {tex(R)}$"]
        steps.append(f"ОДЗ: ${tex(inner)} \\geq 0$")
        if op == '=':
            steps.append(f"Возводим обе части в квадрат: ${tex(inner)} = \\left({tex(R)}\\right)^2$")
            sols = solve(Eq(inner, R**2), x)
            ok = [s for s in sols if (inner.subs(x, s) >= 0) and simplify(L.subs(x, s) - R) == 0]
            steps.append(f"Решаем: $x = {', '.join(tex(s) for s in sols)}$, проверка по ОДЗ оставляет: $x = {', '.join(tex(s) for s in ok)}$")
            roots = [pretty(s) for s in ok]
        else:
            sol = solve_set(make_rel(L, R, op))
            steps.append(f"Решаем с учётом ОДЗ: $x \\in {latex(sol)}$")
            roots = [str(sol)]
        return self.result("Иррациональное уравнение", steps, roots)

# ---------- ЛОГАРИФМЫ ----------
class LogSolver(BaseSolver):
    def can_solve(self, q):
        try:
            e = parse(split_rel(q)[0] or q)
            e2 = parse(split_rel(q)[2]) if split_rel(q) else 0
            return (e.has(sp.log) or e2.has(sp.log))
        except Exception:
            return False
    def solve(self, q):
        l, op, r = split_rel(q)
        L, R = parse(l), parse(r)
        lg = list(L.atoms(sp.log))
        steps = [f"Дано: ${tex(L)} {op} {tex(R)}$"]
        if lg and R.is_number:
            arg, base = lg[0].args[0], (lg[0].args[1] if len(lg[0].args) > 1 else sp.E)
            steps.append(f"ОДЗ: ${tex(arg)} > 0$")
            rhs = base ** R
            if op == '=':
                steps.append(f"По определению логарифма: ${tex(arg)} = {tex(base)}^{{{tex(R)}}} = {tex(rhs)}$")
                sols = solve(Eq(arg, rhs), x)
                ok = [s for s in sols if arg.subs(x, s) > 0]
                steps.append(f"Корни: $x = {', '.join(tex(s) for s in sols)}$; с учётом ОДЗ: $x = {', '.join(tex(s) for s in ok)}$")
                roots = [pretty(s) for s in ok]
            else:
                flip = (base.is_number and 0 < base < 1)
                nop = op if not flip else {'<': '>', '>': '<', '<=': '>=', '>=': '<='}[op]
                steps.append(f"Так как основание ${tex(base)} {'< 1' if flip else '> 1'}: ${tex(arg)} {nop} {tex(rhs)}$")
                sol = solve_set([make_rel(arg, rhs, nop), sp.Gt(arg, 0)], x)
                steps.append(f"С учётом ОДЗ: $x \\in {latex(sol)}$")
                roots = [str(sol)]
        else:
            sol = solve_set(make_rel(L, R, op)) if op != '=' else solve(Eq(L, R), x)
            steps.append(f"Решаем: ${latex(sol)}$")
            roots = [str(sol)] if not isinstance(sol, list) else [pretty(s) for s in sol]
        return self.result("Логарифмическое уравнение/неравенство", steps, roots)

# ---------- ПОКАЗАТЕЛЬНЫЕ ----------
class ExpSolver(BaseSolver):
    def can_solve(self, q):
        sr = split_rel(q)
        try:
            L = parse(sr[0]); R = parse(sr[2])
            return has_x_exp(L) or has_x_exp(R)
        except Exception:
            return False
    def solve(self, q):
        l, op, r = split_rel(q)
        L, R = parse(l), parse(r)
        pows = [p for p in (L.atoms(sp.Pow) | R.atoms(sp.Pow)) if p.exp.has(x)]
        base = pows[0].base if pows else 2
        steps = [f"Дано: ${tex(L)} {op} {tex(R)}$"]
        # приведение к t = base^x
        def to_t(e):
            def cond(e): return isinstance(e, sp.Pow) and e.base == base and e.exp.has(x)
            def func(e):
                lc = linear_coefs(e.exp, x)
                if not lc: return None
                m, c = lc
                return base**c * t**m
            r2 = e.replace(cond, func)
            return r2 if not r2.has(x) else None
        Lt, Rt = to_t(L), to_t(R if R.has(x) else R)
        if Lt is not None and Rt is not None and (Lt.has(t) or Rt.has(t)):
            steps.append(f"Все степени — с основанием ${tex(base)}$. Замена: $t = {tex(base)}^x,\\ t > 0$")
            steps.append(f"Получаем: ${tex(Lt)} {op} {tex(Rt)}$")
            if op == '=':
                ts = solve(Eq(Lt, Rt), t)
                roots = []
                for tv in ts:
                    if tv.is_real and tv > 0:
                        xv = simplify(log(tv, base))
                        steps.append(f"$t = {tex(tv)} \\Rightarrow {tex(base)}^x = {tex(tv)} \\Rightarrow x = {tex(xv)}$")
                        roots.append(pretty(xv))
                    else:
                        steps.append(f"$t = {tex(tv)}$ не подходит (нужно $t > 0$)")
            else:
                sol_t = solve_set(make_rel(Lt, Rt, op), t)
                steps.append(f"Решаем относительно t: $t \\in {latex(sol_t)}$")
                sol = solve_set(make_rel(L, R, op), x)
                steps.append(f"Возвращаемся к x: $x \\in {latex(sol)}$")
                roots = [str(sol)]
        else:
            # одинаковое основание с обеих сторон
            steps.append(f"Приводим обе части к основанию ${tex(base)}$ и сравниваем показатели (функция {'возрастает' if base > 1 else 'убывает'})")
            sol = solve_set(make_rel(L, R, op)) if op != '=' else solve(Eq(L, R), x)
            steps.append(f"Ответ: ${latex(sol)}$")
            roots = [str(sol)] if not isinstance(sol, list) else [pretty(s) for s in sol]
        return self.result("Показательное уравнение/неравенство", steps, roots)

# ---------- ТРИГОНОМЕТРИЯ ----------
class TrigSolver(BaseSolver):
    def can_solve(self, q):
        return bool(re.search(r'sin|cos|tan', q))
    def solve(self, q):
        l, op, r = split_rel(q)
        L, R = parse(l), parse(r)
        steps = [f"Дано: ${tex(L)} {op} {tex(R)}$"]
        expr = L - R
        # квадратное относительно sin: заменяем cos^2 -> 1 - sin^2
        if expr.has(cos(x)**2):
            expr2 = expand(expr.subs(cos(x)**2, 1 - sin(x)**2))
            steps.append(f"Замена $\\cos^2 x = 1 - \\sin^2 x$: получаем ${tex(expr2)} = 0$")
            steps.append(f"Обозначим $t = \\sin x,\\ |t| \\le 1$")
            ts = solve(expr2.subs(sin(x), t), t)
            roots = []
            for tv in ts:
                steps.append(f"$\\sin x = {tex(tv)}$" + ("" if abs(float(tv)) <= 1 else " — не подходит, так как $|\\sin x| \\le 1$"))
                if abs(float(tv)) <= 1:
                    sol = solveset(Eq(sin(x), tv), x, S.Reals)
                    steps.append(f"$x = {latex(sol)}$")
                    roots.append(f"sin x = {pretty(tv)}")
            return self.result("Тригонометрическое уравнение", steps, roots)
        if op == '=':
            v = R
            steps.append(f"Табличное значение: $\\sin x = {tex(v)}$")
            sol = solveset(Eq(L, R), x, S.Reals)
            steps.append(f"Общее решение: $x = {latex(sol)}$, где $k \\in \\mathbb{Z}$")
            return self.result("Тригонометрическое уравнение", steps, [str(sol)])
        sol = solve_set(make_rel(L, R, op))
        steps.append(f"Решаем неравенство: $x \\in {latex(sol)}$")
        return self.result("Тригонометрическое неравенство", steps, [str(sol)])

# ---------- СТЕПЕННЫЕ С ДРОБНЫМ ПОКАЗАТЕЛЕМ ----------
class PowerSolver(BaseSolver):
    def can_solve(self, q):
        try:
            e = parse(split_rel(q)[0] or q)
            for p in e.atoms(sp.Pow):
                if p.base.has(x) and p.exp.is_rational and not p.exp.is_integer:
                    return True
        except Exception:
            return False
    def solve(self, q):
        l, op, r = split_rel(q)
        L, R = parse(l), parse(r)
        steps = [f"Дано: ${tex(L)} = {tex(R)}$"]
        steps.append("Возводим обе части в степень, обратную показателю: $(x^{{p/q}})^{{q/p}} = x$")
        sols = solve(Eq(L, R), x)
        steps.append(f"Получаем: $x = {', '.join(tex(s) for s in sols)}$")
        return self.result("Степенное уравнение", steps, [pretty(s) for s in sols])

# ---------- НЕРАВЕНСТВА (линейные, квадратные, метод интервалов) ----------
class InequalitySolver(BaseSolver):
    def can_solve(self, q):
        sr = split_rel(q)
        return sr is not None and sr[1] in ['<', '>', '<=', '>=']
    def solve(self, q):
        l, op, r = split_rel(q)
        L, R = parse(l), parse(r)
        expr = simplify(L - R)
        steps = [f"Дано неравенство: ${tex(L)} {op} {tex(R)}$"]
        steps.append(f"Переносим всё влево: ${tex(expr)} {op} 0$")
        num, den = expr.as_numer_denom()
        nz, dz = solve(num, x), solve(den, x)
        if den.has(x):
            steps.append(f"Метод интервалов. Нули числителя: $x = {', '.join(tex(z) for z in nz)}$ (точка {'закрашена' if op in ['<=','>='] else 'выколота'}), знаменателя: $x = {', '.join(tex(z) for z in dz)}$ (выколота всегда)")
        else:
            try:
                p = Poly(expr, x)
                if p.degree() == 1:
                    m, c = p.coeff_monomial(x), p.coeff_monomial(1)
                    steps.append(f"Линейное неравенство: ${tex(m)}x {op} {tex(-c)}$")
                    flip = m.is_number and m < 0
                    if flip: steps.append("Делим на отрицательное число — **знак неравенства меняется**")
                elif p.degree() == 2:
                    steps.append(f"Квадратное неравенство. Корни: $x = {', '.join(tex(z) for z in nz)}$")
                    steps.append("Ветви параболы направлены вверх, поэтому знак определяется расположением между корнями")
            except Exception:
                pass
            if nz:
                steps.append(f"Отмечаем точки на числовой прямой: $x = {', '.join(tex(z) for z in nz)}$ и определяем знаки на интервалах")
        sol = solve_set(make_rel(expr, 0, op))
        steps.append(f"Ответ: $x \\in {latex(sol)}$")
        return self.result("Неравенство (метод интервалов)", steps, [str(sol)])

# ---------- ДРОБИ: СОКРАЩЕНИЕ И СЛОЖЕНИЕ ----------
class FractionSimplifySolver(BaseSolver):
    def can_solve(self, q):
        if split_rel(q): return False
        try:
            e = parse(q)
            n, d = e.as_numer_denom()
            return d.has(x)
        except Exception:
            return False
    def solve(self, q):
        e = parse(q)
        n, d = e.as_numer_denom()
        steps = [f"Дано выражение: ${tex(e)}$"]
        dz = solve(d, x)
        steps.append(f"ОДЗ: знаменатель $\\neq 0$: $x \\neq {', '.join(tex(z) for z in dz)}$")
        steps.append(f"Раскладываем на множители: числитель $= {tex(factor(n))}$, знаменатель $= {tex(factor(d))}$")
        res = cancel(e)
        steps.append(f"Сокращаем / приводим к общему знаменателю: $= {tex(res)}$")
        return self.result("Алгебраическая дробь", steps, [str(res)],
                           domain=f"ОДЗ: $x \\neq {', '.join(tex(z) for z in dz)}$")

# ---------- ОДНОЧЛЕНЫ, МНОГОЧЛЕНЫ, ФСУ ----------
class PolyOpsSolver(BaseSolver):
    def can_solve(self, q):
        if split_rel(q): return False
        try:
            e = parse(q)
            return e.has(x) or e.has(y)
        except Exception:
            return False
    def solve(self, q):
        e = parse(q)
        steps = [f"Дано выражение: ${tex(e)}$"]
        ex = expand(e)
        steps.append(f"Раскрываем скобки (умножение): $= {tex(ex)}$")
        fc = factor(e)
        if fc != ex:
            steps.append(f"Раскладываем на множители (ФСУ / группировка): $= {tex(fc)}$")
        steps.append("Использованы правила: $(ab)(cd) = (ac)(bd)$,  $x^m \\cdot x^n = x^{{m+n}}$,  ФСУ: $a^2-b^2=(a-b)(a+b)$")
        return self.result("Одночлены и многочлены", steps, [str(ex), f"множители: {fc}"])

# ---------- УРАВНЕНИЯ С ПАРАМЕТРОМ ----------
class ParamsSolver(BaseSolver):
    def can_solve(self, q):
        sr = split_rel(q)
        if not sr: return False
        try:
            e = parse(sr[0]) - parse(sr[2])
            return a in e.free_symbols
        except Exception:
            return False
    def solve(self, q):
        l, _, r = split_rel(q)
        e = parse(l) - parse(r)
        steps = [f"Дано уравнение с параметром: ${tex(e)} = 0$"]
        fc = factor(e)
        steps.append(f"Раскладываем на множители: ${tex(fc)} = 0$")
        sols = solve(e, x)
        steps.append(f"Приравниваем каждый множитель к нулю: $x = {', '.join(tex(s) for s in sols)}$")
        steps.append("Отдельно рассматриваем случай $a = 0$ (старший коэффициент обращается в ноль)")
        return self.result("Уравнение с параметром", steps, [str(s) for s in sols])

# ---------- БИКВАДРАТНЫЕ ----------
class BiquadraticSolver(BaseSolver):
    def can_solve(self, q):
        sr = split_rel(q)
        if not sr or sr[1] != '=': return False
        try:
            p = Poly(parse(sr[0]) - parse(sr[2]), x)
            if p.degree() != 4: return False
            return all(d in (0, 2, 4) for (m,) in p.monoms() for d in [m[0]])
        except Exception:
            return False
    def solve(self, q):
        l, _, r = split_rel(q)
        p = Poly(parse(l) - parse(r), x)
        A, B, C = p.coeff_monomial(x**4), p.coeff_monomial(x**2), p.coeff_monomial(1)
        steps = [f"Дано биквадратное: ${tex(A)}x^4 + {tex(B)}x^2 + {tex(C)} = 0$"]
        steps.append("Замена: $t = x^2,\\ t \\geq 0$")
        steps.append(f"Квадратное относительно t: ${tex(A)}t^2 + {tex(B)}t + {tex(C)} = 0$")
        D = B**2 - 4*A*C
        steps.append(f"$D = {tex(B)}^2 - 4\\cdot{tex(A)}\\cdot{tex(C)} = {tex(D)}$")
        roots = []
        for tv in solve(A*t**2 + B*t + C, t):
            if tv.is_real and tv >= 0:
                steps.append(f"$t = {tex(tv)} \\geq 0$ — подходит: $x^2 = {tex(tv)} \\Rightarrow x = \\pm {tex(sqrt(tv))}$")
                roots += [pretty(s) for s in solve(Eq(x**2, tv), x)]
            else:
                steps.append(f"$t = {tex(tv)}$ не подходит (нужно $t \\geq 0$)")
        return self.result("Биквадратное уравнение", steps, roots)

# ---------- УРАВНЕНИЯ ВЫСШИХ СТЕПЕНЕЙ ----------
class HigherDegreeSolver(BaseSolver):
    def can_solve(self, q):
        sr = split_rel(q)
        if not sr or sr[1] != '=': return False
        try:
            return Poly(parse(sr[0]) - parse(sr[2]), x).degree() >= 3
        except Exception:
            return False
    def solve(self, q):
        l, _, r = split_rel(q)
        p = Poly(parse(l) - parse(r), x)
        expr = p.as_expr()
        steps = [f"Дано уравнение степени {p.degree()}: ${tex(expr)} = 0$"]
        free = p.coeff_monomial(1); lead = p.LC()
        cand = sorted({Rational(d, c) for d in sp.divisors(int(abs(free))) for c in sp.divisors(int(abs(lead)))})
        steps.append(f"Кандидаты в рациональные корни (делители свободного члена): $x = {', '.join(tex(c) for c in cand[:8])}\\dots$")
        found = next((c for c in cand if simplify(expr.subs(x, c)) == 0), None)
        if found is not None:
            steps.append(f"Проверкой находим корень: $x = {tex(found)}$")
            quot = simplify(expr / (x - found))
            steps.append(f"Делим многочлен на $(x - {tex(found)})$: получаем ${tex(quot)} = 0$")
        fc = factor(expr)
        steps.append(f"Полное разложение: ${tex(fc)} = 0$")
        sols = solve(expr, x)
        steps.append(f"Приравниваем множители к нулю: $x = {', '.join(tex(s) for s in sols)}$")
        return self.result("Уравнение высшей степени", steps, [pretty(s) for s in sols])

# ---------- КВАДРАТНЫЕ ----------
class QuadraticSolver(BaseSolver):
    def can_solve(self, q):
        sr = split_rel(q)
        if not sr or sr[1] != '=': return False
        try:
            return Poly(parse(sr[0]) - parse(sr[2]), x).degree() == 2
        except Exception:
            return False
    def solve(self, q):
        l, _, r = split_rel(q)
        p = Poly(parse(l) - parse(r), x)
        A, B, C = p.coeff_monomial(x**2), p.coeff_monomial(x), p.coeff_monomial(1)
        steps = [f"Дано: ${tex(A)}x^2 + {tex(B)}x + {tex(C)} = 0$, где $a={tex(A)},\\ b={tex(B)},\\ c={tex(C)}$"]
        D = B**2 - 4*A*C
        steps.append(f"Дискриминант: $D = b^2 - 4ac = ({tex(B)})^2 - 4 \\cdot {tex(A)} \\cdot {tex(C)} = {tex(D)}$")
        if D > 0:
            steps.append(f"$D > 0$ — два корня: $x_{{1,2}} = \\frac{{-b \\pm \\sqrt{{D}}}}{{2a}} = \\frac{{-({tex(B)}) \\pm \\sqrt{{{tex(D)}}}}}{{2 \\cdot {tex(A)}}}$")
        elif D == 0:
            steps.append(f"$D = 0$ — один корень: $x = \\frac{{-b}}{{2a}}$")
        else:
            steps.append("$D < 0$ — действительных корней нет")
        sols = solve(A*x**2 + B*x + C, x)
        for s in sols:
            steps.append(f"$x = {tex(s)}$")
        if sols:
            steps.append(f"Теорема Виета: $x_1 + x_2 = {tex(-B/A)}$,  $x_1 \\cdot x_2 = {tex(C/A)}$")
        return self.result("Квадратное уравнение", steps, [pretty(s) for s in sols])

# ---------- ЛИНЕЙНЫЕ ----------
class LinearSolver(BaseSolver):
    def can_solve(self, q):
        sr = split_rel(q)
        if not sr or sr[1] != '=': return False
        try:
            return Poly(parse(sr[0]) - parse(sr[2]), x).degree() == 1
        except Exception:
            return False
    def solve(self, q):
        l, _, r = split_rel(q)
        p = Poly(parse(l) - parse(r), x)
        A, B = p.coeff_monomial(x), p.coeff_monomial(1)
        steps = [f"Дано: ${tex(A)}x + {tex(B)} = 0$"]
        steps.append(f"Переносим свободный член: ${tex(A)}x = {tex(-B)}$")
        steps.append(f"Делим на коэффициент: $x = \\frac{{{tex(-B)}}}{{{tex(A)}}} = {tex(-B/A)}$")
        return self.result("Линейное уравнение", steps, [pretty(-B/A)])

# ---------- ДРОБНО-РАЦИОНАЛЬНЫЕ УРАВНЕНИЯ ----------
class RationalSolver(BaseSolver):
    def can_solve(self, q):
        sr = split_rel(q)
        if not sr or sr[1] != '=': return False
        try:
            e = parse(sr[0]) - parse(sr[2])
            return e.as_numer_denom()[1].has(x)
        except Exception:
            return False
    def solve(self, q):
        l, _, r = split_rel(q)
        e = parse(l) - parse(r)
        num, den = e.as_numer_denom()
        dz = solve(den, x)
        steps = [f"Дано: ${tex(parse(l))} = {tex(parse(r))}$"]
        steps.append(f"ОДЗ: ${tex(den)} \\neq 0 \\Rightarrow x \\neq {', '.join(tex(z) for z in dz)}$")
        steps.append(f"Дробь равна нулю, когда числитель равен нулю: ${tex(factor(num))} = 0$")
        ok = [s for s in solve(num, x) if all(simplify(s - z) != 0 for z in dz)]
        steps.append(f"Корни числителя с учётом ОДЗ: $x = {', '.join(tex(s) for s in ok)}$")
        return self.result("Дробно-рациональное уравнение", steps, [pretty(s) for s in ok],
                           domain=f"ОДЗ: $x \\neq {', '.join(tex(z) for z in dz)}$")

# ---------- УНИВЕРСАЛЬНЫЙ FALLBACK ----------
class GenericSolver(BaseSolver):
    def can_solve(self, q): return True
    def solve(self, q):
        sr = split_rel(q)
        l, op, r = sr
        if op == '=':
            sols = solve(Eq(parse(l), parse(r)), x)
            steps = [f"Решаем уравнение: ${tex(parse(l))} = {tex(parse(r))}$",
                     f"Корни: $x = {', '.join(tex(s) for s in sols)}$"]
            return self.result("Уравнение", steps, [pretty(s) for s in sols])
        sol = solve_set(make_rel(parse(l), parse(r), op))
        steps = [f"Решаем: $x \\in {latex(sol)}$"]
        return self.result("Неравенство", steps, [str(sol)])

# ---------- ДИСПЕТЧЕР ----------
class EquationSolver:
    def __init__(self):
        self.solvers = [ProgressionSolver(), DerivativeSolver(), IntegralSolver(),
                        SystemSolver(), AbsSolver(), RadicalSolver(), LogSolver(),
                        ExpSolver(), TrigSolver(), PowerSolver(), InequalitySolver(),
                        FractionSimplifySolver(), PolyOpsSolver(), ParamsSolver(),
                        BiquadraticSolver(), HigherDegreeSolver(), QuadraticSolver(),
                        LinearSolver(), RationalSolver(), GenericSolver()]
    def solve(self, q: str) -> dict:
        for s in self.solvers:
            try:
                if s.can_solve(q):
                    return s.solve(q)
            except Exception as e:
                continue
        return {"error": "Не удалось распознать задачу"}

solver = EquationSolver()

class SolveRequest(BaseModel):
    query: str

@app.post("/api/solve")
async def solve_equation(req: SolveRequest):
    try:
        return solver.solve(req.query)
    except Exception as e:
        return {"error": f"Ошибка: {str(e)}"}

app.mount("/static", StaticFiles(directory=os.path.join(BASE, "static")), name="static")

@app.get("/")
async def root():
    return FileResponse(os.path.join(BASE, "static", "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))