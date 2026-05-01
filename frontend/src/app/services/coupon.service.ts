// src/app/services/coupon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coupon, CouponRequest, CouponValidation, CouponStats, Seller } from '../models/coupon.model';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiUrl = 'http://localhost:8080/api/coupons';

  constructor(private http: HttpClient) {}

  // ==================== ADMIN ====================

  createGlobalCoupon(request: CouponRequest): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.apiUrl}/admin`, request);
  }

  getAllCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.apiUrl}/admin/all`);
  }

  getGlobalCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.apiUrl}/admin/global`);
  }

  getAllSellers(): Observable<Seller[]> {
    return this.http.get<Seller[]>(`${this.apiUrl}/admin/sellers`);
  }

  blockCoupon(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin/${id}/block`, {});
  }

  unblockCoupon(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin/${id}/unblock`, {});
  }

  // ==================== VENDEUR ====================

  createSellerCoupon(request: CouponRequest): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.apiUrl}/seller`, request);
  }

  getMyCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.apiUrl}/seller/my-coupons`);
  }

  updateMyCoupon(id: number, request: CouponRequest): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.apiUrl}/seller/${id}`, request);
  }

  toggleMyCouponStatus(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/seller/${id}/toggle`, {});
  }

  deleteMyCoupon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/seller/${id}`);
  }

  getMyCouponStats(id: number): Observable<CouponStats> {
    return this.http.get<CouponStats>(`${this.apiUrl}/seller/${id}/stats`);
  }

  // ==================== COMMUN ====================

  getCouponById(id: number): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/${id}`);
  }

  updateCoupon(id: number, request: CouponRequest): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.apiUrl}/${id}`, request);
  }

  deleteCoupon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCouponStats(id: number): Observable<CouponStats> {
    return this.http.get<CouponStats>(`${this.apiUrl}/${id}/stats`);
  }

  // ==================== CLIENT ====================

  validateCoupon(
    code: string,
    sousTotal: number,
    fraisLivraison: number,
    categoryIds?: number[]
  ): Observable<CouponValidation> {
    let params = new HttpParams()
      .set('code', code)
      .set('sousTotal', sousTotal.toString())
      .set('fraisLivraison', fraisLivraison.toString());

    if (categoryIds && categoryIds.length > 0) {
      categoryIds.forEach(id => {
        params = params.append('categoryIds', id.toString());
      });
    }

    return this.http.post<CouponValidation>(`${this.apiUrl}/validate`, null, { params });
  }
}
