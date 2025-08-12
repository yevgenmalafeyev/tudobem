import { NextRequest, NextResponse } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';

// GET /api/admin/users - Get paginated users list with search
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    // Validate parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Get users list with statistics
    try {
      const result = await UserDatabase.getAdminUsersList(page, limit, search);
      console.log('Users API success:', result.users.length, 'users found');
      return NextResponse.json({
        success: true,
        data: result
      });
    } catch (dbError) {
      console.error('Database error in users API:', dbError);
      return NextResponse.json(
        { 
          error: 'Database error',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error fetching admin users list:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users list',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}