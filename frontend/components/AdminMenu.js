"use client";

import Link from "next/link";

export default function AdminMenu() {

  return (

      <div className="flex gap-6 border-b pb-3 mb-6 text-sm font-medium">

            <Link href="/admin/products" className="hover:text-green-600">
                    Products
                          </Link>

                                <Link href="/admin/add-product" className="hover:text-green-600">
                                        Add Product
                                              </Link>

                                                    <Link href="/admin/categories" className="hover:text-green-600">
                                                            Categories
                                                                  </Link>

                                                                        <Link href="/admin/orders" className="hover:text-green-600">
                                                                                Orders
                                                                                      </Link>

                                                                                          </div>

                                                                                            );

                                                                                            }